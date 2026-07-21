"use client";

import { useState, useRef, useEffect } from "react";
import { AMBIENT_SOUNDS } from "@/lib/constants";

export function FocusPlayer() {
  const [active, setActive] = useState<string>("none");
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const soundUrls: Record<string, string> = {
    lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    forest: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    white_noise: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  };

  useEffect(() => {
    if (active === "none") {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    const url = soundUrls[active];
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => {
      // Browser may block autoplay — user must interact first
    });
    audioRef.current = audio;
  }, [active]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Focus Sounds</h3>
      <div className="flex flex-wrap gap-2">
        {AMBIENT_SOUNDS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(active === s.id ? "none" : s.id)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              active === s.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      {active !== "none" && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
        </div>
      )}
    </div>
  );
}
