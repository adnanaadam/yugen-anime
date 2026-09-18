// src/lib/analytics.ts

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 custom event.
 *
 * Safe to call from anywhere: no-ops on the server, and when gtag.js has not
 * loaded (env var unset, dev mode, or blocked by an ad blocker).
 *
 * @example
 * trackEvent("favorite_add", { anime_id: 5114 });
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * Manual SPA pageview. Only use when `send_page_view: false` is set in the
 * gtag config — otherwise GA4 Enhanced Measurement already reports
 * client-side navigations and this would duplicate them.
 */
export function trackPageView(url: string, title?: string) {
  trackEvent("page_view", { page_location: url, page_title: title });
}
