import Link from "next/link";
import { Brain } from "lucide-react";

export default function AuthNotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <div className="max-w-md text-center">
        <div className="mb-4 sm:mb-6 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-violet-500/10">
          <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-violet-500" />
        </div>
        <h1 className="mb-1 sm:mb-2 text-3xl sm:text-4xl font-bold text-balance">404</h1>
        <h2 className="mb-2 sm:mb-4 text-lg sm:text-xl font-semibold text-balance">Page not found</h2>
        <p className="mb-4 sm:mb-6 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97] touch-manipulation"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
