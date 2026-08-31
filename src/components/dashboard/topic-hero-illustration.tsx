"use client";

import { useId } from "react";
import { Sparkles } from "lucide-react";

interface TopicHeroIllustrationProps {
  category?: string;
  topicTitle?: string;
  topicEmoji?: string;
  topicIllustration?: "finance" | "knowledge" | "workplace" | "family" | "relationship" | "focus" | "mindset";
  className?: string;
}

export function TopicHeroIllustration({
  category = "Work & Career",
  topicTitle = "",
  topicEmoji,
  topicIllustration,
  className = "",
}: TopicHeroIllustrationProps) {
  const gradientId = useId();

  // Auto-detect theme from explicit prop or title/category keywords
  let theme: "finance" | "knowledge" | "workplace" | "family" | "relationship" | "focus" = "workplace";

  if (topicIllustration) {
    if (topicIllustration === "mindset") theme = "focus";
    else theme = topicIllustration;
  } else {
    const text = `${category} ${topicTitle}`.toLowerCase();
    if (text.includes("finan") || text.includes("money") || text.includes("cash") || text.includes("budget") || text.includes("wealth") || text.includes("dopamine rule")) {
      theme = "finance";
    } else if (text.includes("read") || text.includes("book") || text.includes("study") || text.includes("learn") || text.includes("feynman") || text.includes("retain") || text.includes("knowledg")) {
      theme = "knowledge";
    } else if (text.includes("fam") || text.includes("parent") || text.includes("home") || text.includes("child") || text.includes("tantrum")) {
      theme = "family";
    } else if (text.includes("relat") || text.includes("empath") || text.includes("listen") || text.includes("friend") || text.includes("love")) {
      theme = "relationship";
    } else if (text.includes("focus") || text.includes("attent") || text.includes("procrastinat") || text.includes("distract") || text.includes("mindset")) {
      theme = "focus";
    } else {
      theme = "workplace";
    }
  }

  // Theme configuration for colors, badges, and emojis
  const themeConfig = {
    finance: {
      defaultEmoji: "💰",
      emojiCluster: ["💰", "💵", "🪙", "📈"],
      badgeLabel: "FINANCE & WEALTH LESSON",
      badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      gradient: "from-amber-500/20 via-emerald-500/10 to-card",
      border: "border-amber-500/30",
    },
    knowledge: {
      defaultEmoji: "📚",
      emojiCluster: ["📚", "📖", "💡", "🎓"],
      badgeLabel: "KNOWLEDGE & LEARNING LESSON",
      badgeColor: "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      gradient: "from-indigo-500/20 via-cyan-500/10 to-card",
      border: "border-indigo-500/30",
    },
    workplace: {
      defaultEmoji: "💼",
      emojiCluster: ["💼", "🤝", "📊", "🏢"],
      badgeLabel: "WORK & EXECUTIVE LESSON",
      badgeColor: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400",
      gradient: "from-blue-500/20 via-violet-500/10 to-card",
      border: "border-blue-500/30",
    },
    family: {
      defaultEmoji: "👨‍👩‍👧‍👦",
      emojiCluster: ["👨‍👩‍👧‍👦", "🏡", "❤️", "🫂"],
      badgeLabel: "FAMILY & HOME LESSON",
      badgeColor: "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400",
      gradient: "from-rose-500/20 via-orange-500/10 to-card",
      border: "border-rose-500/30",
    },
    relationship: {
      defaultEmoji: "💖",
      emojiCluster: ["💖", "💬", "👂", "🤝"],
      badgeLabel: "RELATIONSHIPS & EQ LESSON",
      badgeColor: "bg-pink-500/15 border-pink-500/30 text-pink-600 dark:text-pink-400",
      gradient: "from-pink-500/20 via-purple-500/10 to-card",
      border: "border-pink-500/30",
    },
    focus: {
      defaultEmoji: "🎯",
      emojiCluster: ["🎯", "🧘", "⏱️", "⚡"],
      badgeLabel: "FOCUS & ATTENTION LESSON",
      badgeColor: "bg-teal-500/15 border-teal-500/30 text-teal-600 dark:text-teal-400",
      gradient: "from-teal-500/20 via-emerald-500/10 to-card",
      border: "border-teal-500/30",
    },
  }[theme];

  const currentEmoji = topicEmoji || themeConfig.defaultEmoji;

  return (
    <div
      className={`relative w-full rounded-3xl border-2 ${themeConfig.border} bg-gradient-to-br ${themeConfig.gradient} p-4 sm:p-5 shadow-lg overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Left: Graphic Illustration Artwork (SVG) */}
      <div className="relative w-full sm:w-1/2 h-36 sm:h-40 flex items-center justify-center">
        {/* ─── 1. FINANCE / MONEY ARTWORK ──────────────────────────────────── */}
        {theme === "finance" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            <defs>
              <linearGradient id={`fin-gold-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id={`fin-emerald-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Money Banknote Stack (Left) */}
            <rect x="25" y="65" width="65" height="36" rx="6" fill={`url(#fin-emerald-${gradientId})`} stroke="#10b981" strokeWidth="1.5" />
            <rect x="28" y="60" width="65" height="36" rx="6" fill={`url(#fin-emerald-${gradientId})`} fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
            <circle cx="60" cy="78" r="10" fill="#ffffff" fillOpacity="0.25" />
            <text x="60" y="82" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">💵</text>

            {/* Upward Growth Chart */}
            <path d="M100 95 L130 65 L160 75 L205 35" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="205,30 215,35 208,45" fill="#10b981" />

            {/* Golden Coins Stack (Center/Right) */}
            <g transform="translate(145, 45)">
              <ellipse cx="20" cy="50" rx="18" ry="7" fill={`url(#fin-gold-${gradientId})`} stroke="#b45309" strokeWidth="1" />
              <ellipse cx="20" cy="42" rx="18" ry="7" fill={`url(#fin-gold-${gradientId})`} stroke="#b45309" strokeWidth="1" />
              <ellipse cx="20" cy="34" rx="18" ry="7" fill={`url(#fin-gold-${gradientId})`} stroke="#b45309" strokeWidth="1" />
              <ellipse cx="20" cy="26" rx="18" ry="7" fill={`url(#fin-gold-${gradientId})`} stroke="#b45309" strokeWidth="1.5" />
              <text x="20" y="30" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">₦</text>
            </g>

            {/* Floating Sparkles */}
            <circle cx="110" cy="35" r="3" fill="#fde047" />
            <circle cx="215" cy="70" r="2.5" fill="#fde047" />
          </svg>
        )}

        {/* ─── 2. KNOWLEDGE / BOOK / STUDY ARTWORK ─────────────────────────── */}
        {theme === "knowledge" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            <defs>
              <linearGradient id={`book-grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Open Illuminated Book */}
            <path
              d="M40 95 Q120 80 120 105 Q120 80 200 95 L200 45 Q120 30 120 58 Q120 30 40 45 Z"
              fill={`url(#book-grad-${gradientId})`}
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Book Pages Glow Lines */}
            <line x1="60" y1="58" x2="105" y2="65" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
            <line x1="60" y1="70" x2="105" y2="77" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
            <line x1="135" y1="65" x2="180" y2="58" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
            <line x1="135" y1="77" x2="180" y2="70" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />

            {/* Feynman Lightbulb (Epiphany) */}
            <circle cx="120" cy="28" r="16" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <text x="120" y="34" fill="#854d0e" fontSize="16" fontWeight="bold" textAnchor="middle">💡</text>
            {/* Radiating Wisdom Rays */}
            <line x1="120" y1="6" x2="120" y2="0" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <line x1="98" y1="14" x2="92" y2="9" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <line x1="142" y1="14" x2="148" y2="9" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* ─── 3. WORKPLACE / CAREER ARTWORK ───────────────────────────────── */}
        {theme === "workplace" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            <defs>
              <linearGradient id={`work-briefcase-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>

            {/* Briefcase */}
            <rect x="40" y="45" width="70" height="50" rx="8" fill={`url(#work-briefcase-${gradientId})`} stroke="#ffffff" strokeWidth="1.5" />
            <path d="M60 45 L60 35 Q60 30 75 30 Q90 30 90 35 L90 45" fill="none" stroke="#60a5fa" strokeWidth="3" />
            <rect x="70" y="55" width="10" height="8" rx="2" fill="#fbbf24" />

            {/* Handshake & Strategy Board (Right) */}
            <rect x="135" y="35" width="75" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            {/* Mini Analytics inside screen */}
            <rect x="145" y="65" width="10" height="20" rx="2" fill="#60a5fa" />
            <rect x="160" y="55" width="10" height="30" rx="2" fill="#3b82f6" />
            <rect x="175" y="45" width="10" height="40" rx="2" fill="#10b981" />
            <text x="195" y="55" fill="#ffffff" fontSize="12">🤝</text>
          </svg>
        )}

        {/* ─── 4. FAMILY / HOME ARTWORK ────────────────────────────────────── */}
        {theme === "family" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            <defs>
              <linearGradient id={`home-roof-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Cozy Home */}
            <polygon points="120,20 60,65 180,65" fill={`url(#home-roof-${gradientId})`} stroke="#ffffff" strokeWidth="1.5" />
            <rect x="75" y="65" width="90" height="45" rx="4" fill="#fbbf24" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
            {/* Door & Heart Window */}
            <rect x="105" y="78" width="30" height="32" rx="4" fill="#78350f" />
            <circle cx="120" cy="45" r="8" fill="#ffffff" />
            <text x="120" y="50" fill="#e11d48" fontSize="11" textAnchor="middle">❤️</text>

            {/* Chimney Heart Smoke */}
            <rect x="150" y="30" width="12" height="20" fill="#e11d48" />
            <text x="160" y="24" fill="#f43f5e" fontSize="14">🕊️</text>
          </svg>
        )}

        {/* ─── 5. RELATIONSHIPS / EQ ARTWORK ───────────────────────────────── */}
        {theme === "relationship" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            {/* Twin Interconnected Hearts with Listening Soundwaves */}
            <g transform="translate(60, 35)">
              <circle cx="30" cy="30" r="24" fill="#ec4899" fillOpacity="0.8" />
              <text x="30" y="37" fill="#ffffff" fontSize="20" textAnchor="middle">💖</text>
            </g>
            <g transform="translate(130, 35)">
              <circle cx="30" cy="30" r="24" fill="#8b5cf6" fillOpacity="0.8" />
              <text x="30" y="37" fill="#ffffff" fontSize="20" textAnchor="middle">👂</text>
            </g>
            {/* Mutual soundwaves */}
            <path d="M115 50 Q125 40 135 50" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M110 65 Q125 75 140 65" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        )}

        {/* ─── 6. FOCUS / ATTENTION ARTWORK ────────────────────────────────── */}
        {theme === "focus" && (
          <svg viewBox="0 0 240 130" className="w-full h-full max-w-[240px] drop-shadow-md">
            <defs>
              <linearGradient id={`foc-laser-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>

            {/* Target Rings */}
            <circle cx="120" cy="65" r="48" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="120" cy="65" r="34" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            <circle cx="120" cy="65" r="20" fill="none" stroke="#6366f1" strokeWidth="3" />
            <circle cx="120" cy="65" r="9" fill={`url(#foc-laser-${gradientId})`} />
            <text x="120" y="70" fill="#ffffff" fontSize="12" fontWeight="black" textAnchor="middle">⚡</text>

            {/* Target crosshairs */}
            <line x1="120" y1="10" x2="120" y2="120" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="65" y1="65" x2="175" y2="65" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 2" />
          </svg>
        )}
      </div>

      {/* Right: Fun Illustrated Mood Badge & Emoji Cluster */}
      <div className="w-full sm:w-1/2 space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">
        {/* Category & Theme Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm">
          <span className="text-base">{currentEmoji}</span>
          <span className={themeConfig.badgeColor}>{themeConfig.badgeLabel}</span>
        </div>

        {/* Dynamic Emoji Cluster for Fun Visual Engagement */}
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/80 rounded-2xl px-3.5 py-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
            TOPIC VISUALS:
          </span>
          <div className="flex items-center gap-1 text-lg">
            {themeConfig.emojiCluster.map((em, idx) => (
              <span key={idx} className="hover:scale-125 transition-transform duration-200 cursor-default">
                {em}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-medium">
          Visualized daily concept to help you connect theory directly with practical life mastery.
        </p>
      </div>
    </div>
  );
}
