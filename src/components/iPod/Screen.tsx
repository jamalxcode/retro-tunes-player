import React from 'react';
import { Track } from '@/types/track';

interface ScreenProps {
  track: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
  shuffle: boolean;
  loop: boolean;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const Screen: React.FC<ScreenProps> = ({
  track,
  currentTime,
  duration,
  isPlaying,
  loading,
  error,
  shuffle,
  loop,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="chrome-bezel rounded-lg p-1">
      <div className="lcd-screen rounded-md px-3 py-2 h-[120px] flex flex-col justify-between">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="lcd-text text-sm animate-pulse-glow">Loading...</span>
          </div>
        ) : error && !track ? (
          <div className="flex-1 flex items-center justify-center px-2">
            <span className="lcd-text-dim text-xs text-center leading-relaxed">
              {error.includes('No /music folder') || error.includes('No MP3') 
                ? 'Add MP3s to /music folder'
                : error}
            </span>
          </div>
        ) : track ? (
          <>
            {/* Status bar */}
            <div className="flex items-center justify-between text-[10px] lcd-text-dim mb-1">
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <span className="animate-pulse-glow">▶</span>
                )}
                {shuffle && <span title="Shuffle">⇄</span>}
                {loop && <span title="Loop">↻</span>}
              </div>
              <span>iPod</span>
            </div>

            {/* Track info */}
            <div className="flex-1 flex flex-col justify-center overflow-hidden">
              <div className="lcd-text text-sm font-medium truncate">
                {track.title}
              </div>
              <div className="lcd-text-dim text-xs truncate mt-0.5">
                {track.artist}
              </div>
            </div>

            {/* Progress section */}
            <div className="mt-2">
              {/* Progress bar */}
              <div className="progress-track h-1 rounded-full overflow-hidden">
                <div 
                  className="progress-fill h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Time display */}
              <div className="flex justify-between mt-1 text-[10px] lcd-text-dim">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="lcd-text-dim text-sm">No track selected</span>
          </div>
        )}
      </div>
    </div>
  );
};
