"use client";

import { useId } from "react";

interface QuestionGraphicAvatarProps {
  category?: string;
  subcategory?: string;
  skill?: string;
  className?: string;
}

export function QuestionGraphicAvatar({
  category = "Work & Career",
  subcategory = "",
  skill = "",
  className = "",
}: QuestionGraphicAvatarProps) {
  const gradientId = useId();

  const text = `${category} ${subcategory} ${skill}`.toLowerCase();

  // Determine illustration theme based on semantic keywords
  let theme: "work" | "finance" | "academic" | "family" | "relationship" | "focus" | "brain" = "brain";

  if (text.includes("work") || text.includes("negotiat") || text.includes("meeting") || text.includes("office") || text.includes("boss") || text.includes("executive")) {
    theme = "work";
  } else if (text.includes("finan") || text.includes("cash") || text.includes("money") || text.includes("budget") || text.includes("impulse") || text.includes("invest")) {
    theme = "finance";
  } else if (text.includes("acad") || text.includes("exam") || text.includes("study") || text.includes("learn") || text.includes("feynman") || text.includes("textbook")) {
    theme = "academic";
  } else if (text.includes("fam") || text.includes("parent") || text.includes("child") || text.includes("tantrum") || text.includes("home")) {
    theme = "family";
  } else if (text.includes("relat") || text.includes("listen") || text.includes("empath") || text.includes("conflict") || text.includes("de-escalat")) {
    theme = "relationship";
  } else if (text.includes("focus") || text.includes("attent") || text.includes("procrastinat") || text.includes("phone") || text.includes("dopamine")) {
    theme = "focus";
  }

  return (
    <div
      className={`relative w-full h-36 sm:h-44 rounded-2xl border border-border/80 overflow-hidden shadow-inner flex items-center justify-center p-3 ${
        theme === "work"
          ? "bg-gradient-to-br from-blue-500/15 via-card to-indigo-500/15"
          : theme === "finance"
          ? "bg-gradient-to-br from-amber-500/15 via-card to-emerald-500/15"
          : theme === "academic"
          ? "bg-gradient-to-br from-indigo-500/15 via-card to-cyan-500/15"
          : theme === "family"
          ? "bg-gradient-to-br from-rose-500/15 via-card to-orange-500/15"
          : theme === "relationship"
          ? "bg-gradient-to-br from-violet-500/15 via-card to-pink-500/15"
          : theme === "focus"
          ? "bg-gradient-to-br from-teal-500/15 via-card to-blue-500/15"
          : "bg-gradient-to-br from-primary/15 via-card to-violet-600/15"
      } ${className}`}
    >
      {/* ─── THEME 1: WORK & EXECUTIVE NEGOTIATION ──────────────────────────── */}
      {theme === "work" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`work-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Conference Table */}
          <rect x="30" y="70" width="140" height="24" rx="12" fill="#1e293b" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="2" />
          {/* Executive Figure A (Left) */}
          <circle cx="65" cy="40" r="12" fill={`url(#work-grad-${gradientId})`} />
          <path d="M50 70 C50 55 80 55 80 70 Z" fill={`url(#work-grad-${gradientId})`} />
          {/* Executive Figure B (Right) */}
          <circle cx="135" cy="40" r="12" fill="#6366f1" />
          <path d="M120 70 C120 55 150 55 150 70 Z" fill="#6366f1" />
          {/* Calibrated dialogue bubbles */}
          <path d="M85 30 Q100 18 115 30 L108 38 L95 38 Z" fill="#10b981" />
          <text x="100" y="32" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">💡</text>
        </svg>
      )}

      {/* ─── THEME 2: FINANCIAL DISCIPLINE & CASH FLOW ──────────────────────── */}
      {theme === "finance" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`fin-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {/* Financial Growth Chart Bars */}
          <rect x="35" y="65" width="20" height="35" rx="4" fill="#f59e0b" fillOpacity="0.7" />
          <rect x="65" y="50" width="20" height="50" rx="4" fill="#f59e0b" fillOpacity="0.85" />
          <rect x="95" y="35" width="20" height="65" rx="4" fill="#10b981" fillOpacity="0.9" />
          <rect x="125" y="20" width="20" height="80" rx="4" fill={`url(#fin-grad-${gradientId})`} />
          {/* Wealth Shield / Coin */}
          <circle cx="165" cy="50" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
          <text x="165" y="56" fill="#78350f" fontSize="16" fontWeight="black" textAnchor="middle">₦</text>
          {/* Trend arrow */}
          <path d="M40 55 L90 30 L135 15" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {/* ─── THEME 3: ACADEMICS & ACTIVE RECALL ──────────────────────────────── */}
      {theme === "academic" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`acad-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Open Book */}
          <path d="M40 85 Q100 75 100 95 Q100 75 160 85 L160 50 Q100 40 100 62 Q100 40 40 50 Z" fill={`url(#acad-grad-${gradientId})`} fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
          {/* Feynman Epiphany Lightbulb */}
          <circle cx="100" cy="30" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <path d="M94 44 L106 44 L103 49 L97 49 Z" fill="#94a3b8" />
          {/* Radiating knowledge rays */}
          <line x1="100" y1="10" x2="100" y2="4" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="18" x2="76" y2="13" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="118" y1="18" x2="124" y2="13" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {/* ─── THEME 4: FAMILY & HOME PATIENCE ─────────────────────────────────── */}
      {theme === "family" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`fam-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          {/* Parent Figure */}
          <circle cx="75" cy="40" r="12" fill={`url(#fam-grad-${gradientId})`} />
          <path d="M60 75 C60 58 90 58 90 75 Z" fill={`url(#fam-grad-${gradientId})`} />
          {/* Child Figure */}
          <circle cx="125" cy="55" r="9" fill="#fb923c" />
          <path d="M112 82 C112 68 138 68 138 82 Z" fill="#fb923c" />
          {/* Heart Connection Aura */}
          <path d="M100 35 C95 25 80 25 80 40 C80 55 100 65 100 65 C100 65 120 55 120 40 C120 25 105 25 100 35 Z" fill="#f43f5e" fillOpacity="0.85" />
        </svg>
      )}

      {/* ─── THEME 5: RELATIONSHIPS & ACTIVE LISTENING ───────────────────────── */}
      {theme === "relationship" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`rel-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Speaker A */}
          <circle cx="55" cy="45" r="12" fill={`url(#rel-grad-${gradientId})`} />
          <path d="M40 80 C40 64 70 64 70 80 Z" fill={`url(#rel-grad-${gradientId})`} />
          {/* Active Listener B */}
          <circle cx="145" cy="45" r="12" fill="#ec4899" />
          <path d="M130 80 C130 64 160 64 160 80 Z" fill="#ec4899" />
          {/* Empathy soundwaves */}
          <path d="M80 45 Q100 35 120 45" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M85 55 Q100 48 115 55" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {/* ─── THEME 6: FOCUS, ATTENTION & MINDSET ──────────────────────────────── */}
      {theme === "focus" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`foc-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {/* Concentric Focus Rings (Target) */}
          <circle cx="100" cy="55" r="42" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="100" cy="55" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="100" cy="55" r="16" fill="none" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="100" cy="55" r="7" fill={`url(#foc-grad-${gradientId})`} />
          {/* Crosshairs */}
          <line x1="100" y1="5" x2="100" y2="105" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="55" x2="150" y2="55" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      )}

      {/* ─── DEFAULT THEME: BRAIN NETWORK ────────────────────────────────────── */}
      {theme === "brain" && (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[220px] drop-shadow-md">
          <defs>
            <linearGradient id={`brain-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Dual Hemisphere Brain */}
          <path d="M100 25 C82 25 68 38 68 55 C68 62 72 68 76 73 C71 78 68 85 68 92 C68 102 82 108 100 108 C118 108 132 102 132 92 C132 85 129 78 124 73 C128 68 132 62 132 55 C132 38 118 25 100 25 Z" fill={`url(#brain-grad-${gradientId})`} fillOpacity="0.85" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="100" y1="30" x2="100" y2="105" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          {/* Synaptic nodes */}
          <circle cx="82" cy="48" r="3.5" fill="#fbbf24" />
          <circle cx="118" cy="48" r="3.5" fill="#fbbf24" />
          <circle cx="85" cy="80" r="3.5" fill="#38bdf8" />
          <circle cx="115" cy="80" r="3.5" fill="#38bdf8" />
        </svg>
      )}
    </div>
  );
}
