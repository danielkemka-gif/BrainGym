"use client";

import { useMemo } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  level?: number;
  className?: string;
}

const SIZE_MAP: Record<AvatarSize, { container: string; text: string; ring: string }> = {
  xs: { container: "h-7 w-7", text: "text-[10px]", ring: "ring-1" },
  sm: { container: "h-9 w-9", text: "text-xs", ring: "ring-2" },
  md: { container: "h-11 w-11", text: "text-sm", ring: "ring-2" },
  lg: { container: "h-14 w-14", text: "text-base", ring: "ring-2" },
  xl: { container: "h-20 w-20", text: "text-xl", ring: "ring-3" },
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-zinc-400 to-zinc-500",
  2: "from-slate-300 to-slate-400",
  3: "from-yellow-400 to-amber-500",
  4: "from-cyan-300 to-sky-500",
  5: "from-violet-400 to-purple-600",
  6: "from-indigo-400 to-indigo-600",
  7: "from-emerald-400 to-green-600",
  8: "from-orange-300 to-amber-600",
  9: "from-fuchsia-400 to-pink-600",
  10: "from-blue-300 to-indigo-500",
  11: "from-rose-400 to-red-600",
  12: "from-teal-300 to-cyan-600",
  13: "from-purple-300 to-violet-600",
  14: "from-amber-300 to-yellow-500",
  15: "from-yellow-200 to-amber-400",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name = "", size = "md", level, className = "" }: AvatarProps) {
  const s = SIZE_MAP[size];
  const gradient = LEVEL_COLORS[level ?? 1] ?? LEVEL_COLORS[1];
  const initials = useMemo(() => getInitials(name || "?"), [name]);

  if (src) {
    return (
      <div className={`relative inline-flex shrink-0 ${className}`}>
        <img
          src={src}
          alt={name}
          className={`${s.container} rounded-full object-cover ${s.ring} ring-primary/30`}
        />
        {level !== undefined && (
          <div className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ${s.ring} ring-background`}>
            <span className="text-[8px] font-bold leading-none">{level}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${s.container} flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} ${s.ring} ring-primary/30`}
      >
        <span className={`font-bold text-white ${s.text} leading-none`}>
          {initials}
        </span>
      </div>
      {level !== undefined && (
        <div className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ${s.ring} ring-background`}>
          <span className="text-[8px] font-bold leading-none">{level}</span>
        </div>
      )}
    </div>
  );
}
