"use client";

import React from "react";

export type VisualCategory =
  | "focus"
  | "memory"
  | "problem_solving"
  | "decision_making"
  | "creativity"
  | "observation"
  | "emotional_intelligence"
  | "logic"
  | "speed"
  | "financial_thinking"
  | "strategic_thinking";

interface ContextualChallengeVisualProps {
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function normalizeVisualCategory(cat?: string): VisualCategory {
  if (!cat) return "focus";
  const c = cat.toLowerCase().replace(/[-_]/g, " ");
  if (c.includes("focus") || c.includes("attention") || c.includes("concentration")) return "focus";
  if (c.includes("memory") || c.includes("recall") || c.includes("retention")) return "memory";
  if (c.includes("problem") || c.includes("solve") || c.includes("solution")) return "problem_solving";
  if (c.includes("decision") || c.includes("choice") || c.includes("decide")) return "decision_making";
  if (c.includes("creat") || c.includes("innovat") || c.includes("divergent")) return "creativity";
  if (c.includes("observ") || c.includes("notice") || c.includes("detail") || c.includes("spot")) return "observation";
  if (c.includes("emot") || c.includes("empath") || c.includes("social") || c.includes("intelligence")) return "emotional_intelligence";
  if (c.includes("logic") || c.includes("reason") || c.includes("deduct") || c.includes("think")) return "logic";
  if (c.includes("speed") || c.includes("react") || c.includes("agility") || c.includes("fast")) return "speed";
  if (c.includes("financ") || c.includes("money") || c.includes("resource") || c.includes("econ")) return "financial_thinking";
  if (c.includes("strateg") || c.includes("plan") || c.includes("chess") || c.includes("adapt")) return "strategic_thinking";
  return "focus";
}

/**
 * High-end editorial SVG micro-animated illustrations for BrainGym.
 * Lightweight, accessible, CSS-animated, respecting prefers-reduced-motion.
 */
export function ContextualChallengeVisual({
  category = "focus",
  className = "",
  size = "md",
}: ContextualChallengeVisualProps) {
  const normCategory = normalizeVisualCategory(category);

  // Size dimensions
  const dimensionClass =
    size === "sm"
      ? "w-16 h-16"
      : size === "lg"
      ? "w-28 h-28 sm:w-32 sm:h-32"
      : "w-20 h-20 sm:w-24 sm:h-24";

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden rounded-2xl bg-gradient-to-br from-background/90 via-primary/5 to-primary/15 border border-primary/20 p-2 shadow-inner ${dimensionClass} ${className}`}
      aria-label={`Visual illustration for ${normCategory} mental fitness workout`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-primary"
      >
        <defs>
          <linearGradient id="bgGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="amberGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ef4444" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="emeraldGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ─── 1. FOCUS: Concentric Target & Mind Silhouette with Pulse ─── */}
        {normCategory === "focus" && (
          <g className="animate-bg-focus">
            {/* Outer distraction ring (fading) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.25"
              className="animate-spin-slow origin-center"
            />
            {/* Middle target ring */}
            <circle
              cx="50"
              cy="50"
              r="26"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
            {/* Inner focal target */}
            <circle
              cx="50"
              cy="50"
              r="14"
              fill="url(#bgGlow)"
              className="animate-pulse origin-center"
            />
            {/* Bullseye Center Dot */}
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" filter="url(#glowFilter)" />
            {/* Crosshairs */}
            <line x1="50" y1="12" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="80" x2="50" y2="88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ─── 2. MEMORY: Floating Neural Nodes & Connecting Synaptic Grid ─── */}
        {normCategory === "memory" && (
          <g>
            {/* Connecting Synaptic Lattice */}
            <path
              d="M 28 32 L 50 20 L 72 32 L 64 66 L 36 66 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              fill="none"
            />
            <line x1="50" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="28" y1="32" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="72" y1="32" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="36" y1="66" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="64" y1="66" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Neural Memory Nodes (flipping / glowing) */}
            <rect x="22" y="26" width="12" height="12" rx="3" fill="url(#bgGlow)" className="animate-pulse" />
            <rect x="66" y="26" width="12" height="12" rx="3" fill="url(#bgGlow)" className="animate-pulse" />
            <rect x="44" y="14" width="12" height="12" rx="3" fill="#8b5cf6" />
            <rect x="30" y="60" width="12" height="12" rx="3" fill="#6366f1" />
            <rect x="58" y="60" width="12" height="12" rx="3" fill="#a855f7" />

            {/* Center Core Memory Hub */}
            <circle cx="50" cy="50" r="8" fill="#ffffff" filter="url(#glowFilter)" />
          </g>
        )}

        {/* ─── 3. PROBLEM SOLVING: Geometric Puzzle Segments Forming Solution ─── */}
        {normCategory === "problem_solving" && (
          <g>
            {/* Top-Left Puzzle Block */}
            <path
              d="M 24 24 H 42 V 34 A 4 4 0 0 1 42 42 V 48 H 24 Z"
              fill="url(#bgGlow)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Top-Right Puzzle Block */}
            <path
              d="M 54 24 H 76 V 48 H 58 A 4 4 0 0 0 58 40 H 54 Z"
              fill="#6366f1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Bottom-Left Puzzle Block */}
            <path
              d="M 24 54 H 42 A 4 4 0 0 0 42 62 H 48 V 76 H 24 Z"
              fill="#8b5cf6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Bottom-Right Locking Piece */}
            <path
              d="M 54 54 H 76 V 76 H 54 V 62 A 4 4 0 0 1 54 54 Z"
              fill="#a855f7"
              stroke="currentColor"
              strokeWidth="1.5"
              className="animate-pulse"
            />
            {/* Center Spark of Insight */}
            <circle cx="50" cy="50" r="3.5" fill="#ffffff" filter="url(#glowFilter)" />
          </g>
        )}

        {/* ─── 4. DECISION MAKING: Dual Illuminated Pathways at Crossroads ─── */}
        {normCategory === "decision_making" && (
          <g>
            {/* Starting Root Path */}
            <path
              d="M 50 84 L 50 56"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left Branch */}
            <path
              d="M 50 56 C 45 42, 28 38, 24 22"
              stroke="url(#amberGlow)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
            {/* Right Branch */}
            <path
              d="M 50 56 C 55 42, 72 38, 76 22"
              stroke="url(#emeraldGlow)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Decision Fork Core */}
            <circle cx="50" cy="56" r="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
            {/* Left Choice Node */}
            <circle cx="24" cy="22" r="5" fill="#f59e0b" filter="url(#glowFilter)" />
            {/* Right Choice Node */}
            <circle cx="76" cy="22" r="5" fill="#10b981" filter="url(#glowFilter)" className="animate-pulse" />
          </g>
        )}

        {/* ─── 5. CREATIVITY: Prismatic Crystal Transforming Unexpected Shapes ─── */}
        {normCategory === "creativity" && (
          <g>
            {/* Central Prismatic Core */}
            <polygon
              points="50,22 74,40 64,74 36,74 26,40"
              fill="url(#bgGlow)"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="animate-spin-slow origin-center"
            />
            {/* Refracted Creative Sparks */}
            <circle cx="50" cy="12" r="3.5" fill="#f59e0b" className="animate-bounce" />
            <circle cx="84" cy="36" r="3.5" fill="#ec4899" className="animate-pulse" />
            <circle cx="76" cy="80" r="3" fill="#06b6d4" />
            <circle cx="24" cy="80" r="3" fill="#8b5cf6" />
            <circle cx="16" cy="36" r="3.5" fill="#10b981" className="animate-pulse" />
            {/* Center Core Spark */}
            <circle cx="50" cy="50" r="5" fill="#ffffff" filter="url(#glowFilter)" />
          </g>
        )}

        {/* ─── 6. OBSERVATION: Precision Scanning Lens & Hidden Details ─── */}
        {normCategory === "observation" && (
          <g>
            {/* Lens Outer Housing */}
            <circle cx="48" cy="48" r="28" stroke="currentColor" strokeWidth="3" strokeOpacity="0.4" />
            <circle cx="48" cy="48" r="22" fill="url(#bgGlow)" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
            {/* Lens Handle */}
            <line x1="68" y1="68" x2="86" y2="86" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            {/* Scanning Laser Beam */}
            <line
              x1="28"
              y1="48"
              x2="68"
              y2="48"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="animate-pulse"
            />
            {/* Discovered Hidden Target Node */}
            <circle cx="48" cy="48" r="6" fill="#10b981" filter="url(#glowFilter)" />
            <circle cx="48" cy="48" r="2" fill="#ffffff" />
            {/* Discovered Minor Detail Points */}
            <circle cx="36" cy="38" r="2.5" fill="#f59e0b" />
            <circle cx="58" cy="42" r="2" fill="#ec4899" />
          </g>
        )}

        {/* ─── 7. EMOTIONAL INTELLIGENCE: Dual Profiles & Resonant Empathy Waves ─── */}
        {normCategory === "emotional_intelligence" && (
          <g>
            {/* Left Silhouette Outline */}
            <path
              d="M 22 72 C 22 56, 32 46, 32 36 C 32 26, 26 24, 26 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Silhouette Outline */}
            <path
              d="M 78 72 C 78 56, 68 46, 68 36 C 68 26, 74 24, 74 24"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Resonant Harmonic Empathy Waves between Minds */}
            <path
              d="M 38 42 Q 50 36 62 42"
              stroke="url(#bgGlow)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 40 50 Q 50 56 60 50"
              stroke="#ec4899"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 42 34 Q 50 28 58 34"
              stroke="#10b981"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Connection Node */}
            <circle cx="50" cy="42" r="4" fill="#ffffff" filter="url(#glowFilter)" />
          </g>
        )}

        {/* ─── 8. LOGIC: Interlocking Matrices & Ordered Reasoning Grid ─── */}
        {normCategory === "logic" && (
          <g>
            {/* 3x3 Reasoning Grid */}
            <rect x="22" y="22" width="16" height="16" rx="3" fill="url(#bgGlow)" />
            <rect x="42" y="22" width="16" height="16" rx="3" fill="#6366f1" />
            <rect x="62" y="22" width="16" height="16" rx="3" fill="url(#bgGlow)" />

            <rect x="22" y="42" width="16" height="16" rx="3" fill="#6366f1" />
            <rect x="42" y="42" width="16" height="16" rx="3" fill="#8b5cf6" className="animate-pulse" />
            <rect x="62" y="42" width="16" height="16" rx="3" fill="#6366f1" />

            <rect x="22" y="62" width="16" height="16" rx="3" fill="url(#bgGlow)" />
            <rect x="42" y="62" width="16" height="16" rx="3" fill="#6366f1" />
            <rect x="62" y="62" width="16" height="16" rx="3" fill="#10b981" filter="url(#glowFilter)" />

            {/* Logical deduction arrow / pathway */}
            <line x1="30" y1="30" x2="70" y2="70" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {/* ─── 9. SPEED: Converging Neural Velocity Pathways ─── */}
        {normCategory === "speed" && (
          <g>
            {/* Velocity Motion Streaks */}
            <path
              d="M 12 34 L 54 48"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d="M 16 50 L 62 50"
              stroke="url(#amberGlow)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 12 66 L 54 52"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            {/* Target Strike Focal Core */}
            <circle cx="72" cy="50" r="14" fill="url(#amberGlow)" className="animate-ping origin-center" opacity="0.4" />
            <circle cx="72" cy="50" r="10" fill="#f59e0b" filter="url(#glowFilter)" />
            <polygon points="69,45 78,50 69,55" fill="#ffffff" />
          </g>
        )}

        {/* ─── 10. FINANCIAL & STRATEGIC THINKING: Strategic Neural Matrix ─── */}
        {(normCategory === "financial_thinking" || normCategory === "strategic_thinking") && (
          <g>
            {/* Isometric Chess/Matrix Floor */}
            <path
              d="M 50 20 L 82 36 L 50 52 L 18 36 Z"
              fill="url(#bgGlow)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Strategic Pillars / Choice Nodes */}
            <line x1="50" y1="52" x2="50" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="82" y1="36" x2="82" y2="66" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="36" x2="18" y2="66" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />

            {/* Strategic Queen/King Apex Node */}
            <circle cx="50" cy="20" r="6" fill="#f59e0b" filter="url(#glowFilter)" className="animate-pulse" />
            <circle cx="50" cy="20" r="2.5" fill="#ffffff" />

            {/* Balanced Choice Scales */}
            <circle cx="18" cy="66" r="4.5" fill="#10b981" />
            <circle cx="82" cy="66" r="4.5" fill="#06b6d4" />
            <circle cx="50" cy="82" r="5" fill="#8b5cf6" />
          </g>
        )}
      </svg>
    </div>
  );
}
