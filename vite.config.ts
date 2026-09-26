// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Static build for GitHub Pages: `GITHUB_PAGES=true BASE_PATH=/repo/ npm run build:pages`.
 * Produces a fully static SPA (no server) in dist/client.
 */
const isPages = process.env["GITHUB_PAGES"] === "true";
const basePath = process.env["BASE_PATH"] ?? "/";

export default defineConfig({
  ...(isPages ? { vite: { base: basePath } } : {}),
  tanstackStart: {
    server: { entry: "server" },
    ...(isPages ? { router: { basepath: basePath }, spa: { enabled: true, prerender: { outputPath: "/_shell.html", crawlLinks: false } } } : {}),
  },
});
