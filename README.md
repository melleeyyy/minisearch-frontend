# MiniSearch Frontend

The public web frontend for [MiniSearch](https://github.com/melleeyyy/minisearch-core) —
a small, honest search engine. Dark, minimal, mobile-first; works on tablet and
desktop too.

**Live:** https://melleeyyy.github.io/minisearch-frontend/

## What it does

- **Web search** — BM25-ranked results with highlighted snippets, did-you-mean,
  pagination, autocomplete suggestions.
- **Images** — the engine's own image index. Images are never re-hosted; each
  card links to the original image and its source page.
- **Videos** — proxied Wikimedia Commons video search.
- **Answers** — extractive question answering with confidence, citations and
  conflict warnings. No AI generation: answers are quoted word-for-word from
  indexed pages.
- **Notifications** — live engine status: index size, scoring engine, indexed
  sources.
- **Activity** — your recent searches (stored only on this device) plus
  anonymous engine analytics.

## Tech

- [Vite](https://vitejs.dev) + React 18 + TypeScript
- react-router (hash router, so deep links work on GitHub Pages)
- No UI framework — a single hand-written dark stylesheet (`src/styles/global.css`)

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production bundle in dist/
npm run preview      # serve the production build locally
```

The API base URL defaults to the live backend and can be overridden with
`VITE_API_BASE` (see `.env.example`).

## Deployment

GitHub Actions builds and publishes to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`). Pages must be set to the "GitHub Actions"
source (Settings → Pages).
