export interface Track {
  name: string;
  artist: string;
  title: string;
  url: string;
  path: string;
  albumArt?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  loop: boolean;
}

export interface GitHubFile {
  name: string;
  path: string;
  download_url: string | null;
  type: string;
  size?: number;
  sha?: string;
}
