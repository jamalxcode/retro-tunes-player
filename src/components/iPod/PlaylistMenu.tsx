import React from 'react';
import { X, RefreshCw, Shuffle, Repeat, Music } from 'lucide-react';
import { Track } from '@/types/track';

interface PlaylistMenuProps {
  isOpen: boolean;
  tracks: Track[];
  currentIndex: number;
  shuffle: boolean;
  loop: boolean;
  onClose: () => void;
  onSelectTrack: (index: number) => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  onRefresh: () => void;
}

export const PlaylistMenu: React.FC<PlaylistMenuProps> = ({
  isOpen,
  tracks,
  currentIndex,
  shuffle,
  loop,
  onClose,
  onSelectTrack,
  onToggleShuffle,
  onToggleLoop,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-10 animate-fade-in">
      <div className="chrome-bezel rounded-lg p-1 h-full">
        <div className="menu-overlay rounded-md h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="lcd-text text-sm font-medium">Music</span>
            <button 
              type="button"
              onClick={onClose}
              className="wheel-button p-1 lcd-text-dim hover:lcd-text"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-3 py-2 border-b border-white/10">
            <button
              type="button"
              onClick={onToggleShuffle}
              className={`wheel-button p-1.5 rounded ${shuffle ? 'lcd-text-highlight' : 'lcd-text-dim'}`}
              aria-label="Toggle shuffle"
              title="Shuffle"
            >
              <Shuffle size={14} />
            </button>
            <button
              type="button"
              onClick={onToggleLoop}
              className={`wheel-button p-1.5 rounded ${loop ? 'lcd-text-highlight' : 'lcd-text-dim'}`}
              aria-label="Toggle loop"
              title="Loop"
            >
              <Repeat size={14} />
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="wheel-button p-1.5 rounded lcd-text-dim hover:lcd-text"
              aria-label="Refresh tracks"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Track list */}
          <div className="flex-1 overflow-y-auto menu-scroll">
            {tracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <Music size={24} className="lcd-text-dim mb-2" />
                <span className="lcd-text-dim text-xs">
                  No tracks found
                </span>
              </div>
            ) : (
              <div className="py-1">
                {tracks.map((track, index) => (
                  <button
                    type="button"
                    key={track.path}
                    onClick={() => {
                      onSelectTrack(index);
                      onClose();
                    }}
                    className={`menu-item w-full text-left px-3 py-2 ${
                      index === currentIndex ? 'playing' : 'lcd-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {index === currentIndex && (
                        <span className="text-xs animate-pulse-glow">▶</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {track.title}
                        </div>
                        <div className="text-[10px] lcd-text-dim truncate">
                          {track.artist}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
