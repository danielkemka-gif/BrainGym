"use client";

import { useMemo } from "react";
import { AVATAR_COLORS, AVATAR_EVOLUTION_STAGES } from "@/lib/constants";
import type { AvatarStage } from "@/lib/constants";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

interface CustomAvatarProps {
  bodyType?: string;
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  outfitId?: string;
  backgroundId?: string;
  frameId?: string;
  accessoryId?: string;
  expression?: string;
  evolutionStage?: AvatarStage;
  size?: AvatarSize;
  className?: string;
  showFrame?: boolean;
  showStage?: boolean;
}

const SIZE_MAP: Record<AvatarSize, { container: string; text: string; ring: string }> = {
  xs: { container: "h-7 w-7", text: "text-[8px]", ring: "ring-1" },
  sm: { container: "h-9 w-9", text: "text-[10px]", ring: "ring-2" },
  md: { container: "h-12 w-12", text: "text-xs", ring: "ring-2" },
  lg: { container: "h-16 w-16", text: "text-sm", ring: "ring-2" },
  xl: { container: "h-24 w-24", text: "text-base", ring: "ring-3" },
  hero: { container: "h-40 w-40", text: "text-2xl", ring: "ring-4" },
};

const FRAME_COLORS: Record<string, string> = {
  none: "",
  gold: "ring-yellow-400 ring-3",
  neon: "ring-cyan-400 ring-3 shadow-[0_0_12px_rgba(34,211,238,0.5)]",
  brain: "ring-purple-400 ring-3 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
};

const EXPRESSION_MAP: Record<string, string> = {
  happy: "😊",
  focus: "🤔",
  fire: "🔥",
  star: "⭐",
  cosmic: "🌌",
};

const STAGE_EMOJIS: Record<string, string> = {
  egg: "🥚",
  hatchling: "🐣",
  sapling: "🌱",
  guardian: "🛡️",
  brain_lord: "🧠",
};

export function CustomAvatar({
  bodyType = "round",
  skinTone = "warm",
  hairStyle = "short",
  hairColor,
  outfitId = "basic",
  backgroundId = "default",
  frameId = "none",
  accessoryId = "none",
  expression = "happy",
  evolutionStage = "egg",
  size = "md",
  className = "",
  showFrame = true,
  showStage = false,
}: CustomAvatarProps) {
  const s = SIZE_MAP[size];
  const skinColor = AVATAR_COLORS.skin[skinTone as keyof typeof AVATAR_COLORS.skin] ?? AVATAR_COLORS.skin.warm;
  const hair = hairColor ?? AVATAR_COLORS.hair[hairStyle as keyof typeof AVATAR_COLORS.hair] ?? AVATAR_COLORS.hair.short;
  const outfitColor = AVATAR_COLORS.outfit[outfitId as keyof typeof AVATAR_COLORS.outfit] ?? AVATAR_COLORS.outfit.basic;
  const bgColor = AVATAR_COLORS.bg[backgroundId as keyof typeof AVATAR_COLORS.bg] ?? AVATAR_COLORS.bg.default;
  const frameClass = showFrame ? (FRAME_COLORS[frameId] ?? "") : "";
  const stageInfo = AVATAR_EVOLUTION_STAGES.find((st) => st.id === evolutionStage);

  const bodyClipPath = useMemo(() => {
    switch (bodyType) {
      case "square": return "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)";
      case "tall": return "ellipse(45% 50% at 50% 50%)";
      default: return "circle(50% at 50% 50%)";
    }
  }, [bodyType]);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${s.container} relative overflow-hidden rounded-full ${s.ring} ${frameClass} ring-primary/30`}
        style={{ backgroundColor: bgColor }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Body */}
          <g clipPath={`url(#clip-${bodyType})`}>
            {/* Head */}
            <circle cx="50" cy="35" r="22" fill={skinColor} />

            {/* Hair */}
            {hairStyle === "short" && (
              <path d="M28 30 Q50 8 72 30 Q72 18 50 12 Q28 18 28 30Z" fill={hair} />
            )}
            {hairStyle === "long" && (
              <path d="M26 28 Q50 5 74 28 L74 55 Q60 50 50 52 Q40 50 26 55Z" fill={hair} />
            )}
            {hairStyle === "curly" && (
              <>
                <circle cx="32" cy="20" r="8" fill={hair} />
                <circle cx="50" cy="14" r="9" fill={hair} />
                <circle cx="68" cy="20" r="8" fill={hair} />
                <circle cx="26" cy="30" r="7" fill={hair} />
                <circle cx="74" cy="30" r="7" fill={hair} />
              </>
            )}
            {hairStyle === "mohawk" && (
              <path d="M42 12 Q50 -2 58 12 Q55 20 50 22 Q45 20 42 12Z" fill={hair} />
            )}
            {hairStyle === "afro" && (
              <circle cx="50" cy="28" r="28" fill={hair} opacity="0.9" />
            )}
            {hairStyle === "spiky" && (
              <>
                <path d="M35 15 L40 0 L45 18Z" fill={hair} />
                <path d="M45 12 L50 -4 L55 12Z" fill={hair} />
                <path d="M55 15 L60 0 L65 18Z" fill={hair} />
                <path d="M28 22 L32 8 L38 20Z" fill={hair} />
                <path d="M62 22 L68 8 L72 20Z" fill={hair} />
              </>
            )}
            {hairStyle === "crown" && (
              <>
                <path d="M30 28 L35 8 L42 22 L50 4 L58 22 L65 8 L70 28Z" fill="#fbbf24" />
                <circle cx="35" cy="8" r="3" fill="#ef4444" />
                <circle cx="50" cy="4" r="3" fill="#3b82f6" />
                <circle cx="65" cy="8" r="3" fill="#10b981" />
              </>
            )}

            {/* Eyes */}
            <circle cx="40" cy="35" r="3" fill="white" />
            <circle cx="60" cy="35" r="3" fill="white" />
            <circle cx={expression === "focus" ? "41" : "40"} cy="35" r="1.5" fill="#1e293b" />
            <circle cx={expression === "focus" ? "61" : "60"} cy="35" r="1.5" fill="#1e293b" />

            {/* Mouth */}
            {expression === "happy" && (
              <path d="M42 43 Q50 50 58 43" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
            {expression === "focus" && (
              <line x1="44" y1="44" x2="56" y2="44" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {expression === "fire" && (
              <path d="M42 43 Q50 50 58 43" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            {expression === "star" && (
              <path d="M42 43 Q50 48 58 43" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            {expression === "cosmic" && (
              <path d="M42 43 Q50 50 58 43" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}

            {/* Body/clothes */}
            <path d="M25 60 Q25 55 35 55 L65 55 Q75 55 75 60 L75 85 Q75 90 50 90 Q25 90 25 85Z" fill={outfitColor} />

            {/* Accessory: glasses */}
            {accessoryId === "glasses" && (
              <>
                <circle cx="40" cy="35" r="6" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                <circle cx="60" cy="35" r="6" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                <line x1="46" y1="35" x2="54" y2="35" stroke="#1e293b" strokeWidth="1" />
              </>
            )}
            {accessoryId === "headphones" && (
              <>
                <path d="M22 30 Q22 15 50 15 Q78 15 78 30" stroke="#ef4444" strokeWidth="3" fill="none" />
                <rect x="18" y="28" width="8" height="12" rx="3" fill="#ef4444" />
                <rect x="74" y="28" width="8" height="12" rx="3" fill="#ef4444" />
              </>
            )}
            {accessoryId === "crown" && (
              <>
                <path d="M32 18 L38 5 L44 15 L50 2 L56 15 L62 5 L68 18Z" fill="#fbbf24" />
                <circle cx="38" cy="5" r="2" fill="#ef4444" />
                <circle cx="50" cy="2" r="2" fill="#3b82f6" />
                <circle cx="62" cy="5" r="2" fill="#10b981" />
              </>
            )}
          </g>

          <defs>
            <clipPath id="clip-round">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
            <clipPath id="clip-square">
              <rect x="4" y="4" width="92" height="92" rx="10" />
            </clipPath>
            <clipPath id="clip-tall">
              <ellipse cx="50" cy="50" rx="42" ry="48" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Evolution stage badge */}
      {showStage && stageInfo && (
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs ring-1 ring-background">
          {stageInfo.emoji}
        </div>
      )}
    </div>
  );
}
