import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '@/types/track';

const STORAGE_KEY = 'ipod-player-state';

function loadSavedState(): Partial<PlayerState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return {};
}

function saveState(state: Partial<PlayerState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

export function useAudioPlayer(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(() => {
    const saved = loadSavedState();
    return {
      currentTrack: null,
      currentIndex: saved.currentIndex ?? -1,
      isPlaying: false,
      currentTime: saved.currentTime ?? 0,
      duration: 0,
      volume: saved.volume ?? 0.8,
      shuffle: saved.shuffle ?? false,
      loop: saved.loop ?? false,
    };
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;
    // Enable CORS for GitHub raw files
    audioRef.current.crossOrigin = 'anonymous';

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    };

    const handleEnded = () => {
      setState((s) => ({ ...s, isPlaying: false }));
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setState((s) => ({ ...s, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Restore track on mount if we have tracks
  useEffect(() => {
    if (tracks.length > 0 && state.currentIndex >= 0 && !state.currentTrack) {
      const savedIndex = Math.min(state.currentIndex, tracks.length - 1);
      const track = tracks[savedIndex];
      if (track && audioRef.current) {
        setState((s) => ({ ...s, currentTrack: track, currentIndex: savedIndex }));
        audioRef.current.src = track.url;
        
        // Wait for audio to be loaded before seeking (one-time listener)
        const savedTime = state.currentTime;
        if (savedTime > 0) {
          const audio = audioRef.current;
          const handleCanPlay = () => {
            if (audio) {
              audio.currentTime = Math.min(savedTime, audio.duration || savedTime);
              audio.removeEventListener('canplay', handleCanPlay);
            }
          };
          audio.addEventListener('canplay', handleCanPlay, { once: true });
        }
      }
    }
  }, [tracks]);

  // Save state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveState({
        currentIndex: state.currentIndex,
        currentTime: state.currentTime,
        volume: state.volume,
        shuffle: state.shuffle,
        loop: state.loop,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [state]);

  // Handle track end - auto advance
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (state.loop) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        // Auto-advance to next track
        const nextIdx = state.shuffle 
          ? Math.floor(Math.random() * tracks.length)
          : (state.currentIndex + 1) % tracks.length;
        
        if (tracks[nextIdx] && tracks.length > 0) {
          audio.src = tracks[nextIdx].url;
          audio.currentTime = 0;
          setState((s) => ({
            ...s,
            currentTrack: tracks[nextIdx],
            currentIndex: nextIdx,
            currentTime: 0,
          }));
          audio.play().catch(console.error);
        }
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [state.loop, state.shuffle, state.currentIndex, tracks]);

  const play = useCallback((track?: Track, index?: number) => {
    if (!audioRef.current) return;

    if (track && typeof index === 'number') {
      audioRef.current.src = track.url;
      audioRef.current.currentTime = 0;
      setState((s) => ({
        ...s,
        currentTrack: track,
        currentIndex: index,
        currentTime: 0,
      }));
    }

    audioRef.current.play().then(() => {
      setState((s) => ({ ...s, isPlaying: true }));
    }).catch((e) => {
      console.error('Failed to play:', e);
    });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.currentTrack) {
      play();
    } else if (tracks.length > 0) {
      play(tracks[0], 0);
    }
  }, [state.isPlaying, state.currentTrack, tracks, play, pause]);

  const getNextIndex = useCallback((currentIdx: number): number => {
    if (tracks.length === 0) return -1;
    
    if (state.shuffle) {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * tracks.length);
      } while (nextIdx === currentIdx && tracks.length > 1);
      return nextIdx;
    }
    
    return (currentIdx + 1) % tracks.length;
  }, [tracks.length, state.shuffle]);

  const getPrevIndex = useCallback((currentIdx: number): number => {
    if (tracks.length === 0) return -1;
    
    if (state.shuffle) {
      let prevIdx;
      do {
        prevIdx = Math.floor(Math.random() * tracks.length);
      } while (prevIdx === currentIdx && tracks.length > 1);
      return prevIdx;
    }
    
    return currentIdx <= 0 ? tracks.length - 1 : currentIdx - 1;
  }, [tracks.length, state.shuffle]);

  const nextTrack = useCallback(() => {
    const nextIdx = getNextIndex(state.currentIndex);
    if (nextIdx >= 0 && tracks[nextIdx]) {
      play(tracks[nextIdx], nextIdx);
    }
  }, [state.currentIndex, tracks, getNextIndex, play]);

  const prevTrack = useCallback(() => {
    // If more than 3 seconds in, restart current track
    if (state.currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIdx = getPrevIndex(state.currentIndex);
    if (prevIdx >= 0 && tracks[prevIdx]) {
      play(tracks[prevIdx], prevIdx);
    }
  }, [state.currentIndex, state.currentTime, tracks, getPrevIndex, play]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
  }, [state.duration]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setState((s) => ({ ...s, volume: clampedVolume }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((s) => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const toggleLoop = useCallback(() => {
    setState((s) => ({ ...s, loop: !s.loop }));
  }, []);

  const selectTrack = useCallback((index: number) => {
    if (tracks[index]) {
      play(tracks[index], index);
    }
  }, [tracks, play]);

  return {
    ...state,
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleShuffle,
    toggleLoop,
    selectTrack,
  };
}
