# iPod Classic MP3 Player

A web-based MP3 player styled like a 2007 iPod Classic. Host your music on GitHub Pages with zero configuration.

## Quick Start

### 1. Fork this repository
Click the "Fork" button at the top right of this page.

### 2. Enable GitHub Pages
1. Go to your forked repo's **Settings** → **Pages**
2. Under "Build and deployment", select **GitHub Actions** as the source
3. The workflow will auto-deploy on each push

### 3. Add your MP3 files
1. Create a `/music` folder in your repository root
2. Upload your MP3 files to this folder
3. Optionally add album art (see below)

### 4. Done!
Visit `https://yourusername.github.io/repo-name`

## Features

- 🎵 **Auto-detects** MP3 files from `/music` folder via GitHub API
- 🎨 **Album art support** - matching images display on screen
- 📀 **Authentic design** - brushed metal iPod Classic styling
- ▶️ **Full controls** - play/pause, next/prev, seek, volume, shuffle, loop
- 💾 **Remembers** last track and position
- 📱 **Responsive** - works on desktop and mobile
- 🚫 **Zero config** - no manifest files needed

## File Naming

### Music Files
Name your MP3 files like:
```
Artist Name - Song Title.mp3
```
Files without ` - ` separator show filename as title with "Unknown Artist".

### Album Art
Add images to `/music` folder. The player checks for matches in this order:
1. **Exact match**: `Artist - Song.jpg` for `Artist - Song.mp3`
2. **Artist match**: `Artist.jpg` for all tracks by that artist
3. **Generic**: `cover.jpg`, `album.jpg`, or `folder.jpg` as fallback

Supported formats: `.jpg`, `.jpeg`, `.png`

## Local Development

```bash
npm install
npm run dev
```

To test with a GitHub repo locally, set these in browser console:
```javascript
localStorage.setItem('dev-github-owner', 'yourusername');
localStorage.setItem('dev-github-repo', 'yourrepo');
```
Then refresh the page.

## Deploying with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Technical Details

- Pure React + TypeScript + Vite
- Uses GitHub Contents API to list files (no auth required for public repos)
- Caches track list in localStorage (1 hour, refreshable via menu)
- Works entirely client-side - no backend needed

## Rate Limits

GitHub API allows 60 requests/hour for unauthenticated users. The player caches the track list to minimize API calls. If rate limited, cached tracks will still play.

## Troubleshooting

**"No /music folder found"**
- Ensure you have a folder named exactly `music` (lowercase) in your repo root
- Add at least one `.mp3` file to the folder

**"API rate limit exceeded"**
- Wait an hour for the rate limit to reset
- Cached tracks will continue to work

**Player shows "Deploy to GitHub Pages..."**
- The player auto-detects GitHub Pages URLs
- For local testing, set `dev-github-owner` and `dev-github-repo` in localStorage

## License

MIT
