import React, { useState } from 'react';
import { useGitHubTracks } from '@/hooks/useGitHubTracks';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Screen } from './Screen';
import { ClickWheel } from './ClickWheel';
import { PlaylistMenu } from './PlaylistMenu';
import { TrackListPanel } from './TrackListPanel';

export const IPodPlayer: React.FC = () => {
  const { tracks, loading, error, refresh } = useGitHubTracks();
  const player = useAudioPlayer(tracks);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      {/* Track List Panel */}
      <TrackListPanel
        tracks={tracks}
        currentIndex={player.currentIndex}
        isPlaying={player.isPlaying}
        shuffle={player.shuffle}
        loop={player.loop}
        onSelectTrack={player.selectTrack}
        onToggleShuffle={player.toggleShuffle}
        onToggleLoop={player.toggleLoop}
        onRefresh={refresh}
        loading={loading}
      />

      {/* iPod Device */}
      <div className="ipod-body w-[320px] rounded-[2rem] p-6 relative">
        {/* Screen area */}
        <div className="mt-2 relative">
          <Screen
            track={player.currentTrack}
            currentTime={player.currentTime}
            duration={player.duration}
            isPlaying={player.isPlaying}
            loading={loading}
            error={error}
            shuffle={player.shuffle}
            loop={player.loop}
          />
          
          <PlaylistMenu
            isOpen={menuOpen}
            tracks={tracks}
            currentIndex={player.currentIndex}
            shuffle={player.shuffle}
            loop={player.loop}
            onClose={() => setMenuOpen(false)}
            onSelectTrack={player.selectTrack}
            onToggleShuffle={player.toggleShuffle}
            onToggleLoop={player.toggleLoop}
            onRefresh={refresh}
          />
        </div>

        {/* Click wheel area */}
        <div className="mt-6">
          <ClickWheel
            isPlaying={player.isPlaying}
            volume={player.volume}
            onTogglePlay={player.togglePlay}
            onPrev={player.prevTrack}
            onNext={player.nextTrack}
            onMenu={() => setMenuOpen(!menuOpen)}
            onVolumeChange={player.setVolume}
          />
        </div>
      </div>
    </div>
  );
};
