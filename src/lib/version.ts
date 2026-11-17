/**
 * AKUCHE UNIFIED VERSION & BUILD IDENTIFIER
 * Single Source of Truth across Desktop, Tablet, Smartphone (WAP) and Installed PWA.
 */

export const AKUCHE_APP_VERSION = "21.0.0";
export const AKUCHE_BUILD_ID = "2026.11.17-v21.0-clarity";
export const AKUCHE_SW_CACHE_VERSION = "akuche-v21-clarity-pwa";
export const AKUCHE_RELEASE_CHANNEL = "personal-clarity-platform";
export const AKUCHE_BUILD_DATE = "2026-11-17";

export interface AkucheVersionInfo {
  version: string;
  buildId: string;
  swCacheVersion: string;
  releaseChannel: string;
  buildDate: string;
  timestamp: string;
}

export function getAkucheVersionInfo(): AkucheVersionInfo {
  return {
    version: AKUCHE_APP_VERSION,
    buildId: AKUCHE_BUILD_ID,
    swCacheVersion: AKUCHE_SW_CACHE_VERSION,
    releaseChannel: AKUCHE_RELEASE_CHANNEL,
    buildDate: AKUCHE_BUILD_DATE,
    timestamp: new Date().toISOString(),
  };
}
