"use client";

import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { PostHogProvider } from "@/lib/analytics/provider";
import { MotionConfig } from "framer-motion";

function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PostHogProvider>
        <ReducedMotionProvider>
          <Suspense>
            <I18nProvider>{children}</I18nProvider>
          </Suspense>
        </ReducedMotionProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}
