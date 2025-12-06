import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Determine if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // For GitHub Pages deployment, use the repo subdirectory as base
  // For local development, use root
  base: isGitHubPages ? "/retro-tunes-player/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));