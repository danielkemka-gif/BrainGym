"use client";

import { Suspense, type ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { PostHogProvider } from "@/lib/analytics/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <Suspense>
        <I18nProvider>{children}</I18nProvider>
      </Suspense>
    </PostHogProvider>
  );
}
