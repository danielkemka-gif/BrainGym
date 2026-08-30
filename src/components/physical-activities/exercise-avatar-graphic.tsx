"use client";

import { useId } from "react";

interface ExerciseAvatarGraphicProps {
  type: string;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
}

export function ExerciseAvatarGraphic({
  type,
  size = "md",
  className = "",
}: ExerciseAvatarGraphicProps) {
  const gradientId = useId();

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    hero: "w-full max-w-[280px] h-48 sm:h-56",
  }[size];

  // Distinct rich SVG graphic avatar based on exercise type
  switch (type) {
    case "walking":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-primary/20 border border-emerald-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`walk-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Ground line */}
            <line x1="10" y1="85" x2="90" y2="85" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
            {/* Head / Mind aura */}
            <circle cx="50" cy="24" r="10" fill={`url(#walk-grad-${gradientId})`} />
            <circle cx="50" cy="24" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 2" className="animate-spin" style={{ transformOrigin: "50px 24px", animationDuration: "8s" }} />
            {/* Body */}
            <path d="M50 34 L52 56" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            {/* Arms swinging in rhythm */}
            <path d="M51 40 L65 48" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M51 40 L35 48" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            {/* Legs walking */}
            <path d="M52 56 L64 82" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            <path d="M52 56 L36 80" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            {/* Oxygen / Vitality bubbles */}
            <circle cx="68" cy="22" r="3" fill="#10b981" fillOpacity="0.7" />
            <circle cx="76" cy="16" r="4" fill="#3b82f6" fillOpacity="0.7" />
          </svg>
        </div>
      );

    case "meditation":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20 border border-violet-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`med-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Calming breath pulse circles */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Head in calm state */}
            <circle cx="50" cy="30" r="9" fill={`url(#med-grad-${gradientId})`} />
            <circle cx="50" cy="30" r="14" fill="#8b5cf6" fillOpacity="0.2" />
            {/* Torso */}
            <path d="M50 39 L50 62" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
            {/* Lotus arms */}
            <path d="M50 45 L32 55 L38 68" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 45 L68 55 L62 68" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Crossed legs (Lotus pose) */}
            <path d="M28 76 Q50 68 72 76" stroke={`url(#med-grad-${gradientId})`} strokeWidth="5" strokeLinecap="round" />
            {/* Third-eye insight dot */}
            <circle cx="50" cy="27" r="2" fill="#ffffff" />
          </svg>
        </div>
      );

    case "reading":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-sky-500/10 to-indigo-500/20 border border-blue-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`read-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Open Book */}
            <path d="M20 65 Q50 60 50 78 Q50 60 80 65 L80 40 Q50 35 50 52 Q50 35 20 40 Z" fill={`url(#read-grad-${gradientId})`} fillOpacity="0.85" />
            <line x1="50" y1="52" x2="50" y2="78" stroke="#ffffff" strokeWidth="2" />
            {/* Reader Head focused forward */}
            <circle cx="50" cy="22" r="8" fill="#3b82f6" />
            {/* Spark of ideas above book */}
            <path d="M46 12 L50 6 L54 12 L50 8 Z" fill="#fbbf24" />
            <circle cx="34" cy="18" r="2.5" fill="#38bdf8" />
            <circle cx="66" cy="18" r="2.5" fill="#38bdf8" />
          </svg>
        </div>
      );

    case "drawing":
    case "handwriting":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/20 border border-amber-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`write-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            {/* Notepad paper */}
            <rect x="22" y="24" width="46" height="56" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="2" />
            <line x1="30" y1="36" x2="58" y2="36" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="46" x2="54" y2="46" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="56" x2="50" y2="56" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            {/* Pen in hand */}
            <path d="M74 22 L82 30 L52 68 L44 68 L44 60 Z" fill={`url(#write-grad-${gradientId})`} />
            <circle cx="44" cy="68" r="2" fill="#1e293b" />
            {/* Creativity spark */}
            <path d="M78 12 L80 16 L84 18 L80 20 L78 24 L76 20 L72 18 L76 16 Z" fill="#fbbf24" />
          </svg>
        </div>
      );

    case "eating":
    case "nutrition":
    case "hydration":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-sky-500/20 border border-teal-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`nutr-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            {/* Bowl / Vessel */}
            <path d="M22 48 Q50 82 78 48 Z" fill={`url(#nutr-grad-${gradientId})`} />
            <ellipse cx="50" cy="48" rx="28" ry="8" fill="#14b8a6" />
            {/* Brain food / Berry nutrients */}
            <circle cx="40" cy="42" r="5" fill="#ef4444" />
            <circle cx="52" cy="40" r="6" fill="#8b5cf6" />
            <circle cx="62" cy="44" r="5" fill="#10b981" />
            {/* Vitality steam */}
            <path d="M44 32 Q40 22 48 14" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M56 32 Q60 22 52 14" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case "music":
    case "listening":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 border border-indigo-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`music-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
            {/* Headphone arch */}
            <path d="M26 50 Q50 16 74 50" stroke={`url(#music-grad-${gradientId})`} strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Earcups */}
            <rect x="20" y="46" width="12" height="22" rx="6" fill="#6366f1" />
            <rect x="68" y="46" width="12" height="22" rx="6" fill="#d946ef" />
            {/* Rhythm soundwaves */}
            <path d="M42 56 L46 48 L50 62 L54 44 L58 56" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      );

    case "sleeping":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800/40 via-indigo-950/30 to-purple-900/40 border border-indigo-500/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Crescent Moon */}
            <path d="M60 22 Q40 32 44 60 Q52 46 68 44 Q56 36 60 22 Z" fill="#fbbf24" />
            {/* Sleep Stars */}
            <circle cx="28" cy="30" r="2" fill="#ffffff" />
            <circle cx="34" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="74" cy="28" r="2" fill="#ffffff" />
            {/* Pillow / Cloud */}
            <path d="M24 72 Q50 58 76 72 Q50 82 24 72 Z" fill="#6366f1" fillOpacity="0.7" />
            {/* Restoration Zzz */}
            <text x="64" y="60" fill="#a5b4fc" fontSize="12" fontWeight="bold" fontFamily="monospace">Z</text>
            <text x="72" y="48" fill="#a5b4fc" fontSize="9" fontWeight="bold" fontFamily="monospace">z</text>
          </svg>
        </div>
      );

    case "coordination":
    case "nature":
    case "planning":
    default:
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-indigo-500/20 border border-primary/30 p-2 overflow-hidden shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`def-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Brain Shape */}
            <path d="M50 25 C40 25 32 32 32 42 C32 46 34 50 36 53 C33 56 32 60 32 64 C32 72 40 78 50 78 C60 78 68 72 68 64 C68 60 67 56 64 53 C66 50 68 46 68 42 C68 32 60 25 50 25 Z" fill={`url(#def-grad-${gradientId})`} fillOpacity="0.85" />
            <line x1="50" y1="28" x2="50" y2="75" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
            {/* Energy spark rings */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>
      );
  }
}
