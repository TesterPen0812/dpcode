// FILE: registerServiceWorker.ts
// Purpose: Registers the PWA service worker for installability + offline fallback.
// Layer: Web shell bootstrap
// Notes: No-op in Electron and in dev — the worker only matters for the
//        installable browser/PWA experience and must never shadow Vite's dev
//        module pipeline or the desktop app's local asset loading.

import { isElectron } from "./env";

export function registerServiceWorker(): void {
  if (isElectron) return;
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  // Vite serves source modules directly in dev; a SW would only get in the way.
  if (import.meta.env.DEV) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      // Registration failure is non-fatal — the app still works online.
      console.debug("Service worker registration failed", error);
    });
  });
}
