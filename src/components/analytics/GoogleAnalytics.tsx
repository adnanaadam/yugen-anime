// src/components/analytics/GoogleAnalytics.tsx
import Script from "next/script";

/**
 * Loads Google Analytics 4 (gtag.js) site-wide.
 *
 * - Rendered once from the root layout; `next/script` de-duplicates the tags
 *   across client-side navigations.
 * - Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, and stays off
 *   in development unless NEXT_PUBLIC_GA_DEBUG=true (keeps dev hits out of the
 *   production property).
 *
 * Pageviews for client-side navigations are reported by GA4 Enhanced
 * Measurement ("Page changes based on browser history events").
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const debug = process.env.NEXT_PUBLIC_GA_DEBUG === "true";

  if (!gaId) return null;
  if (process.env.NODE_ENV !== "production" && !debug) return null;

  return (
    <>
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}'${debug ? ", { debug_mode: true }" : ""});
          `,
        }}
      />
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}
