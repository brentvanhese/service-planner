# MyService

Offline-first PWA to plan and track monthly service hours. All data lives in `localStorage` on the device — no backend, no accounts.

## Develop
```bash
npm install
npm run dev
```
In dev mode, Settings has a "Load sample data" button; production starts empty.

## Deploy to GitHub Pages
1. Push to `main`.
2. In the repo: Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo>/` and publishes `dist/client`.

Local static build: `BASE_PATH=/myrepo/ npm run build:pages` (use `/` for a custom domain).

## Structure
- `src/lib/types.ts` — data model (settings, months, planned activities, service entries)
- `src/lib/storage/` — the only code touching localStorage (swap for sync later)
- `src/lib/store.ts` — reactive hook over storage
- `src/lib/stats.ts` — goal/pace calculations
- `src/components/app/` — UI components; `src/routes/` — screens
- `public/sw.js`, `public/manifest.webmanifest` — offline + install
