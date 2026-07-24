"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (POSTHOG_KEY && POSTHOG_HOST && typeof window !== "undefined") {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage",
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    let url = pathname;
    if (searchParams?.toString()) {
      url += `?${searchParams.toString()}`;
    }

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const handleRouteChange = () => {
      posthog.capture("$pageleave", {
        $current_url: window.location.href,
      });
    };

    window.addEventListener("beforeunload", handleRouteChange);
    return () => window.removeEventListener("beforeunload", handleRouteChange);
  }, []);

  return <>{children}</>;
}

export { posthog };
