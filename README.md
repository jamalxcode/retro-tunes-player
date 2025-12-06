# iPod Classic MP3 Player

A web-based MP3 player styled like a 2007 iPod Classic. Host your music on GitHub Pages with zero configuration.

![iPod Classic Style](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPod_classic.png/150px-IPod_classic.png)

## Quick Start

1. **Fork this repository**
2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click Save
3. **Add your MP3 files**
   - Create a `/music` folder in your repository
   - Upload your MP3 files to this folder
4. **Done!** Visit `https://yourusername.github.io/repo-name`

## Features

- 🎵 Auto-detects MP3 files from `/music` folder via GitHub API
- 📀 Authentic iPod Classic visual design
- ▶️ Full playback controls: play/pause, next/prev, seek, volume
- 🔀 Shuffle and loop modes
- 💾 Remembers last track and position
- 📱 Works on desktop and mobile
- 🚫 No configuration files needed

## File Naming

For best results, name your MP3 files like:
```
Artist Name - Song Title.mp3
```

The player will parse this format to show artist and title separately. Files without ` - ` separator will show the filename as the title with "Unknown Artist".

## Local Development

```bash
npm install
npm run dev
```

For local testing with GitHub API, set these in browser localStorage:
```javascript
localStorage.setItem('dev-github-owner', 'yourusername');
localStorage.setItem('dev-github-repo', 'yourrepo');
```

## Technical Details

- Pure React + TypeScript
- Uses GitHub Contents API to list files
- Caches track list in localStorage (refreshable)
- No backend required
- Works entirely client-side

## Rate Limits

GitHub API has rate limits for unauthenticated requests (60/hour). The player caches the track list to minimize API calls. If rate limited, cached tracks will still play.

## License

MIT
