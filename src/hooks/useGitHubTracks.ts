import { useState, useEffect, useCallback } from 'react';
import { Track, GitHubFile } from '@/types/track';

const CACHE_KEY = 'ipod-tracks-cache';
const CACHE_TIMESTAMP_KEY = 'ipod-tracks-timestamp';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

function parseTrackInfo(filename: string): { artist: string; title: string } {
  // Remove .mp3 extension
  const name = filename.replace(/\.mp3$/i, '');
  
  // Try to split by " - " for artist/title format
  const parts = name.split(' - ');
  
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim(),
    };
  }
  
  return {
    artist: 'Unknown Artist',
    title: name.trim(),
  };
}

function getRepoInfo(): { owner: string; repo: string } | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages format: username.github.io/repo-name
  if (hostname.endsWith('.github.io')) {
    const owner = hostname.replace('.github.io', '');
    const pathParts = pathname.split('/').filter(Boolean);
    const repo = pathParts[0] || owner; // If no path, repo name equals username (user site)
    
    return { owner, repo };
  }
  
  // For local development, try to use a demo/fallback
  // You can set these in localStorage for testing
  const devOwner = localStorage.getItem('dev-github-owner');
  const devRepo = localStorage.getItem('dev-github-repo');
  
  if (devOwner && devRepo) {
    return { owner: devOwner, repo: devRepo };
  }
  
  return null;
}

export function useGitHubTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCachedTracks = useCallback((): Track[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (e) {
      console.warn('Failed to load cached tracks:', e);
    }
    return null;
  }, []);

  const cacheTracks = useCallback((tracks: Track[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(tracks));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.warn('Failed to cache tracks:', e);
    }
  }, []);

  const fetchTracks = useCallback(async (forceRefresh = false): Promise<void> => {
    setLoading(true);
    setError(null);

    // Try cache first unless forcing refresh
    if (!forceRefresh) {
      const cached = loadCachedTracks();
      if (cached && cached.length > 0) {
        setTracks(cached);
        setLoading(false);
        return;
      }
    }

    const repoInfo = getRepoInfo();
    
    if (!repoInfo) {
      // Try loading from local /music folder for development
      setError('Could not detect GitHub repository. Deploy to GitHub Pages or set dev-github-owner and dev-github-repo in localStorage.');
      setLoading(false);
      return;
    }

    const { owner, repo } = repoInfo;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/music`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.status === 403) {
        const cached = loadCachedTracks();
        if (cached && cached.length > 0) {
          setTracks(cached);
          setError('API rate limited. Showing cached tracks.');
        } else {
          setError('GitHub API rate limit exceeded. Please try again later.');
        }
        setLoading(false);
        return;
      }

      if (response.status === 404) {
        setError('No /music folder found. Add MP3 files to a "music" folder in your repository.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const files: GitHubFile[] = await response.json();
      
      const mp3Files = files.filter(
        (file) => file.type === 'file' && file.name.toLowerCase().endsWith('.mp3')
      );

      // Get image files for album art matching
      const imageFiles = files.filter(
        (file) => file.type === 'file' && 
          (file.name.toLowerCase().endsWith('.jpg') || 
           file.name.toLowerCase().endsWith('.jpeg') || 
           file.name.toLowerCase().endsWith('.png'))
      );

      // Create a map of base names to image URLs
      const imageMap = new Map<string, string>();
      imageFiles.forEach((img) => {
        const baseName = img.name.replace(/\.(jpg|jpeg|png)$/i, '').toLowerCase();
        imageMap.set(baseName, img.download_url);
      });

      if (mp3Files.length === 0) {
        setError('No MP3 files found in /music folder.');
        setLoading(false);
        return;
      }

      const newTracks: Track[] = mp3Files.map((file) => {
        const { artist, title } = parseTrackInfo(file.name);
        const baseName = file.name.replace(/\.mp3$/i, '').toLowerCase();
        
        // Try to find matching album art
        const albumArt = imageMap.get(baseName) || 
                        imageMap.get(artist.toLowerCase()) ||
                        imageMap.get('cover') ||
                        imageMap.get('album') ||
                        imageMap.get('folder');
        
        return {
          name: file.name,
          artist,
          title,
          url: file.download_url,
          path: file.path,
          albumArt,
        };
      });

      // Sort by artist, then title
      newTracks.sort((a, b) => {
        const artistCompare = a.artist.localeCompare(b.artist);
        return artistCompare !== 0 ? artistCompare : a.title.localeCompare(b.title);
      });

      setTracks(newTracks);
      cacheTracks(newTracks);
      setError(null);
    } catch (e) {
      console.error('Failed to fetch tracks:', e);
      
      const cached = loadCachedTracks();
      if (cached && cached.length > 0) {
        setTracks(cached);
        setError('Failed to load tracks. Showing cached version.');
      } else {
        setError(e instanceof Error ? e.message : 'Failed to load tracks.');
      }
    } finally {
      setLoading(false);
    }
  }, [loadCachedTracks, cacheTracks]);

  const refresh = useCallback(() => {
    fetchTracks(true);
  }, [fetchTracks]);

  useEffect(() => {
    fetchTracks(false);
  }, [fetchTracks]);

  return { tracks, loading, error, refresh };
}
