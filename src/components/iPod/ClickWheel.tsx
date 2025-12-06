import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Menu,
  Volume2
} from 'lucide-react';

interface ClickWheelProps {
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMenu: () => void;
  onVolumeChange: (volume: number) => void;
}

export const ClickWheel: React.FC<ClickWheelProps> = ({
  isPlaying,
  volume,
  onTogglePlay,
  onPrev,
  onNext,
  onMenu,
  onVolumeChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Click Wheel */}
      <div className="click-wheel w-[200px] h-[200px] rounded-full relative flex items-center justify-center">
        {/* Menu button - top */}
        <button 
          onClick={onMenu}
          className="wheel-button absolute top-3 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground"
          aria-label="Menu"
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>

        {/* Previous button - left */}
        <button 
          onClick={onPrev}
          className="wheel-button absolute left-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
          aria-label="Previous track"
        >
          <SkipBack size={18} strokeWidth={2.5} />
        </button>

        {/* Next button - right */}
        <button 
          onClick={onNext}
          className="wheel-button absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
          aria-label="Next track"
        >
          <SkipForward size={18} strokeWidth={2.5} />
        </button>

        {/* Play/Pause button - bottom */}
        <button 
          onClick={onTogglePlay}
          className="wheel-button absolute bottom-3 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={18} strokeWidth={2.5} />
          ) : (
            <Play size={18} strokeWidth={2.5} />
          )}
        </button>

        {/* Center select button */}
        <button 
          onClick={onTogglePlay}
          className="wheel-center w-[72px] h-[72px] rounded-full wheel-button flex items-center justify-center"
          aria-label="Select"
        >
          <span className="sr-only">Select</span>
        </button>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-3 w-full max-w-[180px] px-3 py-2 rounded-full bg-muted/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),inset_0_-1px_1px_rgba(255,255,255,0.5)]">
        <Volume2 size={14} className="text-muted-foreground flex-shrink-0" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider w-full"
          aria-label="Volume"
        />
      </div>
    </div>
  );
};
