const CANONICAL_SITE_URL = "https://brain-gym-nsu6.vercel.app";

/**
 * Returns the canonical base URL of the app.
 *
 * Guards against a localhost value for NEXT_PUBLIC_APP_URL leaking into
 * production builds (which would make referral links, share cards and
 * payment callbacks point at the visitor's own machine).
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && /^https?:\/\//.test(configured)) {
    const base = configured.replace(/\/+$/, "");
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(base);
    if (!isLocalhost || process.env.NODE_ENV !== "production") {
      return base;
    }
  }
  return CANONICAL_SITE_URL;
}

