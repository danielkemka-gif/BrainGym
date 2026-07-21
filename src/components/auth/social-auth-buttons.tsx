"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const providers = [{ id: "google" as const, label: "Google", icon: "G" }];

export function SocialAuthButtons({
  redirectTo,
}: {
  redirectTo?: string;
}) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function handleOAuth(provider: "google") {
    setLoading((prev) => ({ ...prev, [provider]: true }));
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          redirectTo ||
          `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {providers.map((p) => (
        <button
          key={p.id}
          onClick={() => handleOAuth(p.id)}
          disabled={loading[p.id]}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {loading[p.id] ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          ) : (
            <span className="text-base font-bold">{p.icon}</span>
          )}
          {p.label}
        </button>
      ))}
    </div>
  );
}
