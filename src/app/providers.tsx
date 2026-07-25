"use client";

import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { PostHogProvider } from "@/lib/analytics/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PostHogProvider>
        <Suspense>
          <I18nProvider>{children}</I18nProvider>
        </Suspense>
      </PostHogProvider>
    </ThemeProvider>
  );
}
