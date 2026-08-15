"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getLevelProgress } from "@/lib/scoring";
import { PartyPopper } from "lucide-react";

const KEY = "braingym_last_level_v1";

export function LevelUpCelebration() {
  const { user, supabase } = useAuth();
  const [show, setShow] = useState(false);
  const [levelName, setLevelName] = useState("");

  useEffect(() => {
    if (!user) return;

    supabase
      .from("xp_ledger")
      .select("amount")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const total = (data ?? []).reduce((sum, row) => sum + (row.amount ?? 0), 0);
        const { level } = getLevelProgress(total);
        const levelNumber: number = level.level;
        const last = Number(localStorage.getItem(KEY) ?? 0);

        if (levelNumber > last && levelNumber > 1) {
          setLevelName(level.title ?? `Level ${levelNumber}`);
          setShow(true);
        }
        localStorage.setItem(KEY, String(levelNumber));
      });
  }, [user, supabase]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Level Up!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You reached <span className="font-semibold text-foreground">{levelName}</span>.
          Keep training to climb the ranks!
        </p>
        <button
          onClick={() => setShow(false)}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}
