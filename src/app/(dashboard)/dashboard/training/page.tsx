"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DailyTrainingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/workout");
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
        <p className="text-sm font-bold text-muted-foreground">
          Launching your daily interactive brain workout...
        </p>
      </div>
    </div>
  );
}
