import React, { useState } from 'react';
import { useGitHubTracks } from '@/hooks/useGitHubTracks';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Screen } from './Screen';
import { ClickWheel } from './ClickWheel';
import { PlaylistMenu } from './PlaylistMenu';

export const IPodPlayer: React.FC = () => {
  const { tracks, loading, error, refresh } = useGitHubTracks();
  const player = useAudioPlayer(tracks);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ipod-body w-[320px] rounded-[2rem] p-6 relative">
      {/* iPod branding */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-muted-foreground/40 text-[10px] font-medium tracking-widest">
        iPod
      </div>

      {/* Screen area */}
      <div className="mt-4 relative">
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
  );
};
