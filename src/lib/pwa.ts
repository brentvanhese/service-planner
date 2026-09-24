/** Registers the offline service worker in production (skipped in editor previews/iframes). */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  const inIframe = window.self !== window.top;
  const isPreviewHost = /lovableproject\.com|id-preview--/.test(window.location.hostname);
  if (inIframe || isPreviewHost) return;
  const base = import.meta.env.BASE_URL;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {});
  });
}
