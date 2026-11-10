# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**iPod Classic MP3 Player** is a web MP3 player styled like a 2007 iPod Classic, live at https://music.sala.company. It discovers MP3s in the repo's `/music` folder at runtime through the GitHub Contents API and plays them client-side (no backend). Tech: React 18 + TypeScript + Vite 5 (SWC plugin), Tailwind CSS, shadcn/ui (Radix) components, `react-router-dom` with `HashRouter`. Scaffolded with Lovable (`lovable-tagger` in dev mode).

## Commands

```bash
npm install
npm run dev         # Vite dev server on port 8080 (host "::")
npm run build       # production build to dist/
npm run build:dev   # build in development mode
npm run preview     # preview the built dist/
npm run lint        # eslint .
```

There is no test suite. Both `package-lock.json` and `bun.lockb` exist; CI uses `npm ci`, so keep `package-lock.json` in sync.

Local dev runs in **demo mode** (sample SoundHelix tracks) unless you set, in the browser console:
```js
localStorage.setItem('dev-github-owner', '<owner>');
localStorage.setItem('dev-github-repo', '<repo>');
```

## Architecture

- `index.html` -> `src/main.tsx` -> `src/App.tsx` (QueryClient, Toasters, `HashRouter`, routes `/` -> `pages/Index.tsx`, `*` -> `pages/NotFound.tsx`).
- `src/components/iPod/`: `iPodPlayer.tsx` (top-level device), `Screen.tsx`, `ClickWheel.tsx`, `PlaylistMenu.tsx`, `TrackListPanel.tsx`.
- `src/hooks/useGitHubTracks.ts`: track discovery.
  - `getRepoInfo()` resolves owner/repo from a hard-coded custom-domain map (`'music.sala.company' -> jamalxcode/retro-tunes-player`), else from `*.github.io` URLs, else from the `dev-github-*` localStorage keys, else returns null (demo mode with `DEMO_TRACKS`).
  - Fetches `https://api.github.com/repos/{owner}/{repo}/contents/music` (unauthenticated, 60 req/hour). Plays files via their `download_url` (raw.githubusercontent.com), so `/music` is **not** part of the Vite build.
  - Filenames parsed as `Artist - Title.mp3`; album art matched by exact base name, then artist name, then `cover`/`album`/`folder` (`.jpg/.jpeg/.png`). Tracks sorted by artist then title.
  - Caches the track list in localStorage for 1 hour under `ipod-tracks-<hostname><first-path-segment>` plus a `-timestamp` key; falls back to cache on 403 (rate limit) or errors. A menu refresh forces a refetch.
- `src/hooks/useAudioPlayer.ts`: playback state (play/pause, seek, volume, shuffle, loop), persisted in localStorage key `ipod-player-state` (last track and position).
- `src/types/track.ts`: `Track`, `PlayerState`, `GitHubFile`.
- `src/components/ui/`: generated shadcn/ui components (mostly unused boilerplate). `@` alias -> `src/`.
- `public/`: `favicon.*`, `robots.txt`, `sitemap.xml`, `.nojekyll`, copied into `dist/`.
- `music/`: the MP3s and matching `.png` cover art served live.

## Deployment

- `.github/workflows/deploy.yml`: on push to `main` (or manual dispatch), Node 20, `npm ci`, `npm run build`, copies `dist/index.html` to `dist/404.html`, uploads `./dist` and deploys with GitHub Pages Actions. **Pushing to `main` deploys live.**
- `vite.config.ts` uses `base: "/"` because the site is on the custom domain root, not a `/repo/` subpath.
- `CNAME` (`music.sala.company`) is at the repo root, not in `public/`, so it is not in the build output; with Actions-based Pages the custom domain comes from the repo's Pages settings.
- `public/.nojekyll` ends up in `dist/`.

## Conventions / gotchas

- Keep the GoatCounter analytics snippet in `index.html` intact (endpoint `https://salacompany.goatcounter.com/count`; skipped on localhost; paths prefixed with `location.host`).
- Adding music: drop `Artist - Title.mp3` (and optional matching image) into `music/` and push. Visitors may see the old list for up to 1 hour because of the localStorage cache.
- If the repo or domain is renamed, update `customDomainMappings` in `useGitHubTracks.ts`, plus the canonical/OG URLs in `index.html` and `public/sitemap.xml`.
- `index.html` sets `color-scheme: light`; layout should work on mobile (README says responsive; `use-mobile.tsx` hook exists).
- No cache-busting strings to bump: Vite hashes asset filenames.
