"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <div className="max-w-md text-center">
        <div className="mb-4 sm:mb-6 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h2 className="mb-2 text-lg sm:text-xl font-bold text-balance">Authentication Error</h2>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
          {error.message || "Something went wrong during authentication. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97] touch-manipulation"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
