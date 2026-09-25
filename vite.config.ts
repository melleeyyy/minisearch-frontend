import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Site is served from a GitHub Pages project URL:
// https://melleeyyy.github.io/minisearch-frontend/
export default defineConfig({
  plugins: [react()],
  base: "/minisearch-frontend/",
  build: { sourcemap: false },
});
