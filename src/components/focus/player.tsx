"use client";

import { useState } from "react";
import { AMBIENT_SOUNDS } from "@/lib/constants";

export function FocusPlayer() {
  const [active, setActive] = useState<string | null>(null);

  function toggle(id: string) {
    setActive((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Select a sound to focus (audio files will load when available)
      </p>
      <div className="grid grid-cols-2 gap-2">
        {AMBIENT_SOUNDS.filter((s) => s.id !== "none").map((sound) => (
          <button
            key={sound.id}
            onClick={() => toggle(sound.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
              active === sound.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <span>{sound.icon}</span>
            <span>{sound.label}</span>
          </button>
        ))}
      </div>
      {active && (
        <p className="text-xs text-muted-foreground">
          Coming soon: ambient audio tracks
        </p>
      )}
    </div>
  );
}
