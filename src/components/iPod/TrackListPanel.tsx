import React from 'react';
import { Music, Shuffle, Repeat, RefreshCw } from 'lucide-react';
import { Track } from '@/types/track';

interface TrackListPanelProps {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  shuffle: boolean;
  loop: boolean;
  onSelectTrack: (index: number) => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const TrackListPanel: React.FC<TrackListPanelProps> = ({
  tracks,
  currentIndex,
  isPlaying,
  shuffle,
  loop,
  onSelectTrack,
  onToggleShuffle,
  onToggleLoop,
  onRefresh,
  loading,
}) => {
  return (
    <div className="track-panel w-[280px] rounded-2xl p-4 flex flex-col h-[520px]">
      {/* Header */}
      <div className="chrome-bezel rounded-lg p-1 mb-3">
        <div className="lcd-screen rounded-md px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music size={14} className="lcd-text" />
              <span className="lcd-text text-sm font-medium">Music Library</span>
            </div>
            <span className="lcd-text-dim text-xs">{tracks.length} tracks</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={onToggleShuffle}
          className={`panel-button p-2 rounded-lg ${shuffle ? 'active' : ''}`}
          aria-label="Toggle shuffle"
          title="Shuffle"
        >
          <Shuffle size={14} />
        </button>
        <button
          type="button"
          onClick={onToggleLoop}
          className={`panel-button p-2 rounded-lg ${loop ? 'active' : ''}`}
          aria-label="Toggle loop"
          title="Loop"
        >
          <Repeat size={14} />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className={`panel-button p-2 rounded-lg ${loading ? 'animate-spin' : ''}`}
          aria-label="Refresh tracks"
          title="Refresh"
          disabled={loading}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Track list */}
      <div className="chrome-bezel rounded-lg p-1 flex-1 overflow-hidden">
        <div className="lcd-screen rounded-md h-full overflow-hidden flex flex-col">
          {tracks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <Music size={32} className="lcd-text-dim mb-3" />
              <span className="lcd-text-dim text-xs leading-relaxed">
                {loading ? 'Loading tracks...' : 'No tracks available'}
              </span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto track-scroll">
              {tracks.map((track, index) => (
                <button
                  type="button"
                  key={track.path}
                  onClick={() => onSelectTrack(index)}
                  className={`track-item w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                    index === currentIndex ? 'playing' : ''
                  }`}
                >
                  {/* Album art thumbnail */}
                  <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-black/30 flex items-center justify-center">
                    {track.albumArt ? (
                      <img 
                        src={track.albumArt} 
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Hide broken image, show fallback
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Music size={14} className={`lcd-text-dim ${track.albumArt ? 'hidden' : ''}`} />
                  </div>
                  
                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {index === currentIndex && isPlaying && (
                        <span className="text-[10px] animate-pulse-glow flex-shrink-0">▶</span>
                      )}
                      <span className={`text-xs font-medium truncate ${
                        index === currentIndex ? 'lcd-text-highlight' : 'lcd-text'
                      }`}>
                        {track.title}
                      </span>
                    </div>
                    <span className="text-[10px] lcd-text-dim truncate block">
                      {track.artist}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
