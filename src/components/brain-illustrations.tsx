"use client";

import React from "react";

interface IllustrationProps {
  className?: string;
}

// ─── MEMORY: Neural network with glowing synapses ──────────────────────────
export function MemoryIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mem-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mem-node" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e0d4ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
        <filter id="mem-blur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#mem-glow)" />
      {/* Synapses */}
      <line x1="12" y1="18" x2="24" y2="12" stroke="#c4b5fd" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="12" x2="36" y2="18" stroke="#c4b5fd" strokeWidth="1" opacity="0.6" />
      <line x1="12" y1="18" x2="16" y2="32" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="18" x2="32" y2="32" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="32" x2="24" y2="38" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="32" x2="24" y2="38" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="12" x2="24" y2="24" stroke="#ddd6fe" strokeWidth="0.8" opacity="0.4" />
      <line x1="16" y1="32" x2="24" y2="24" stroke="#ddd6fe" strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="32" x2="24" y2="24" stroke="#ddd6fe" strokeWidth="0.8" opacity="0.4" />
      {/* Central brain node */}
      <circle cx="24" cy="24" r="6" fill="url(#mem-node)" filter="url(#mem-blur)" opacity="0.3" />
      <circle cx="24" cy="24" r="5" fill="url(#mem-node)" />
      <circle cx="24" cy="24" r="3" fill="#ede9fe" opacity="0.8" />
      {/* Satellite nodes */}
      <circle cx="12" cy="18" r="3" fill="url(#mem-node)" />
      <circle cx="12" cy="18" r="1.5" fill="#ede9fe" opacity="0.7" />
      <circle cx="24" cy="12" r="3.5" fill="url(#mem-node)" />
      <circle cx="24" cy="12" r="1.8" fill="#ede9fe" opacity="0.7" />
      <circle cx="36" cy="18" r="3" fill="url(#mem-node)" />
      <circle cx="36" cy="18" r="1.5" fill="#ede9fe" opacity="0.7" />
      <circle cx="16" cy="32" r="2.5" fill="url(#mem-node)" />
      <circle cx="16" cy="32" r="1.2" fill="#ede9fe" opacity="0.6" />
      <circle cx="32" cy="32" r="2.5" fill="url(#mem-node)" />
      <circle cx="32" cy="32" r="1.2" fill="#ede9fe" opacity="0.6" />
      <circle cx="24" cy="38" r="2" fill="url(#mem-node)" />
      <circle cx="24" cy="38" r="1" fill="#ede9fe" opacity="0.5" />
      {/* Tiny spark particles */}
      <circle cx="18" cy="15" r="0.7" fill="#e0d4ff" opacity="0.9" />
      <circle cx="30" cy="15" r="0.7" fill="#e0d4ff" opacity="0.9" />
      <circle cx="20" cy="28" r="0.5" fill="#ddd6fe" opacity="0.7" />
      <circle cx="28" cy="28" r="0.5" fill="#ddd6fe" opacity="0.7" />
    </svg>
  );
}

// ─── FOCUS: Precision targeting with concentric rings ──────────────────────
export function FocusIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="foc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="foc-center" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="foc-ring" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#foc-glow)" />
      {/* Outer ring */}
      <circle cx="24" cy="24" r="20" stroke="url(#foc-ring)" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="24" cy="24" r="16" stroke="url(#foc-ring)" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="11" stroke="url(#foc-ring)" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Cross hairs */}
      <line x1="24" y1="2" x2="24" y2="10" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="38" x2="24" y2="46" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <line x1="2" y1="24" x2="10" y2="24" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="24" x2="46" y2="24" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      {/* Center dot with glow */}
      <circle cx="24" cy="24" r="4" fill="url(#foc-center)" />
      <circle cx="24" cy="24" r="2" fill="#fffbeb" opacity="0.9" />
      {/* Precision marks */}
      <line x1="18" y1="18" x2="20" y2="20" stroke="#fef3c7" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="18" x2="28" y2="20" stroke="#fef3c7" strokeWidth="1" opacity="0.5" />
      <line x1="18" y1="30" x2="20" y2="28" stroke="#fef3c7" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="30" x2="28" y2="28" stroke="#fef3c7" strokeWidth="1" opacity="0.5" />
      {/* Sparkle */}
      <circle cx="24" cy="24" r="6" fill="#fbbf24" opacity="0.15" />
    </svg>
  );
}

// ─── THINKING: Abstract geometric crystal mind ────────────────────────────
export function ThinkingIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="thk-crystal" x1="10" y1="4" x2="38" y2="44">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <radialGradient id="thk-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <filter id="thk-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#thk-glow)" />
      {/* Outer diamond */}
      <polygon points="24,4 42,24 24,44 6,24" fill="none" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.4" />
      {/* Inner diamond */}
      <polygon points="24,10 36,24 24,38 12,24" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6" />
      {/* Crystal facets */}
      <polygon points="24,14 32,24 24,34 16,24" fill="url(#thk-crystal)" opacity="0.3" />
      <polygon points="24,14 32,24 24,24" fill="#6ee7b7" opacity="0.2" />
      <polygon points="24,14 16,24 24,24" fill="#a7f3d0" opacity="0.15" />
      {/* Center glow */}
      <circle cx="24" cy="24" r="5" fill="url(#thk-crystal)" filter="url(#thk-blur)" opacity="0.3" />
      <circle cx="24" cy="24" r="4" fill="url(#thk-crystal)" />
      <circle cx="24" cy="24" r="2" fill="#d1fae5" opacity="0.8" />
      {/* Orbiting thought particles */}
      <circle cx="24" cy="8" r="1.5" fill="#a7f3d0" opacity="0.8" />
      <circle cx="40" cy="24" r="1.5" fill="#6ee7b7" opacity="0.8" />
      <circle cx="24" cy="40" r="1.5" fill="#34d399" opacity="0.8" />
      <circle cx="8" cy="24" r="1.5" fill="#a7f3d0" opacity="0.8" />
      {/* Tiny connecting lines */}
      <line x1="24" y1="14" x2="24" y2="10" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
      <line x1="32" y1="24" x2="36" y2="24" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
      <line x1="24" y1="34" x2="24" y2="38" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
      <line x1="16" y1="24" x2="12" y2="24" stroke="#6ee7b7" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

// ─── LEARNING: Holographic book with floating data particles ──────────────
export function LearningIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lrn-book" x1="8" y1="12" x2="40" y2="40">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id="lrn-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="lrn-blur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#lrn-glow)" />
      {/* Open book shape */}
      <path d="M24 14 L24 38" stroke="#93c5fd" strokeWidth="1" opacity="0.6" />
      {/* Left page */}
      <path d="M24 14 C20 12, 10 11, 8 14 L8 36 C10 33, 20 34, 24 36 Z" fill="url(#lrn-book)" opacity="0.4" />
      <path d="M24 14 C20 12, 10 11, 8 14 L8 36 C10 33, 20 34, 24 36 Z" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Right page */}
      <path d="M24 14 C28 12, 38 11, 40 14 L40 36 C38 33, 28 34, 24 36 Z" fill="url(#lrn-book)" opacity="0.5" />
      <path d="M24 14 C28 12, 38 11, 40 14 L40 36 C38 33, 28 34, 24 36 Z" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Text lines on pages */}
      <line x1="11" y1="19" x2="21" y2="20" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="11" y1="23" x2="19" y2="24" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.4" />
      <line x1="11" y1="27" x2="20" y2="28" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="11" y1="31" x2="18" y2="32" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.3" />
      <line x1="27" y1="20" x2="37" y2="19" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="27" y1="24" x2="35" y2="23" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.4" />
      <line x1="27" y1="28" x2="36" y2="27" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="27" y1="32" x2="34" y2="31" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.3" />
      {/* Floating knowledge particles */}
      <circle cx="14" cy="8" r="1.2" fill="#93c5fd" opacity="0.7" />
      <circle cx="34" cy="7" r="1" fill="#60a5fa" opacity="0.6" />
      <circle cx="20" cy="6" r="0.8" fill="#bfdbfe" opacity="0.8" />
      <circle cx="30" cy="9" r="0.8" fill="#93c5fd" opacity="0.5" />
      <circle cx="24" cy="5" r="1.5" fill="#60a5fa" filter="url(#lrn-blur)" opacity="0.4" />
      {/* Rising data streams */}
      <line x1="14" y1="8" x2="14" y2="14" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
      <line x1="34" y1="7" x2="34" y2="14" stroke="#60a5fa" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

// ─── HEALTH: Vital heart with energy pulse waves ──────────────────────────
export function HealthIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hlt-heart" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id="hlt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
        <filter id="hlt-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#hlt-glow)" />
      {/* Pulse wave lines */}
      <path d="M4 26 L12 26 L14 20 L18 32 L22 18 L26 34 L30 22 L34 28 L44 28" stroke="#fda4af" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M4 24 L10 24 L13 18 L17 30 L21 16 L25 32 L29 20 L33 26 L44 26" stroke="#fb7185" strokeWidth="0.8" fill="none" opacity="0.2" strokeLinecap="round" />
      {/* Heart shape */}
      <path d="M24 38 C24 38, 8 28, 8 18 C8 12, 12 8, 18 8 C21 8, 23 10, 24 12 C25 10, 27 8, 30 8 C36 8, 40 12, 40 18 C40 28, 24 38, 24 38 Z" fill="url(#hlt-heart)" opacity="0.85" />
      {/* Heart glow */}
      <path d="M24 38 C24 38, 8 28, 8 18 C8 12, 12 8, 18 8 C21 8, 23 10, 24 12 C25 10, 27 8, 30 8 C36 8, 40 12, 40 18 C40 28, 24 38, 24 38 Z" fill="#fda4af" filter="url(#hlt-blur)" opacity="0.3" />
      {/* Heart highlight */}
      <path d="M18 14 C14 14, 11 17, 11 20" stroke="#fecdd3" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
      {/* Life particles */}
      <circle cx="16" cy="10" r="0.8" fill="#fecdd3" opacity="0.8" />
      <circle cx="32" cy="10" r="0.8" fill="#fda4af" opacity="0.7" />
      <circle cx="10" cy="22" r="0.6" fill="#fecdd3" opacity="0.6" />
      <circle cx="38" cy="22" r="0.6" fill="#fda4af" opacity="0.6" />
    </svg>
  );
}

// ─── CREATIVITY: Paint explosion with magic sparkles ──────────────────────
export function CreativityIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="crv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="crv-splash1" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
        <filter id="crv-blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#crv-glow)" />
      {/* Paint splash blobs */}
      <ellipse cx="20" cy="16" rx="6" ry="5" fill="#f0abfc" opacity="0.5" transform="rotate(-15 20 16)" />
      <ellipse cx="30" cy="14" rx="5" ry="4" fill="#e879f9" opacity="0.4" transform="rotate(20 30 14)" />
      <ellipse cx="16" cy="26" rx="5" ry="4" fill="#d946ef" opacity="0.4" transform="rotate(10 16 26)" />
      <ellipse cx="32" cy="28" rx="4" ry="5" fill="#c026d3" opacity="0.35" transform="rotate(-20 32 28)" />
      {/* Paint drips */}
      <path d="M18 18 C16 22, 14 28, 16 34" stroke="#f0abfc" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M30 16 C32 20, 34 26, 32 32" stroke="#e879f9" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      {/* Magic wand */}
      <line x1="22" y1="22" x2="36" y2="8" stroke="#fdf4ff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <circle cx="36" cy="8" r="2" fill="#f5d0fe" opacity="0.8" />
      <circle cx="36" cy="8" r="1" fill="#fdf4ff" />
      {/* Sparkle stars */}
      <path d="M10 12 L11 10 L12 12 L14 11 L12 12 L13 14 L11 13 L10 14 L9 13 L7 14 L8 12 L6 11 L8 12 Z" fill="#f5d0fe" opacity="0.7" />
      <path d="M38 34 L39 32.5 L40 34 L41.5 33 L40 34 L41 35.5 L39 34.5 L38 35.5 L37 34.5 L35 35.5 L36 34 L34 33 L36 34 Z" fill="#e879f9" opacity="0.6" />
      <path d="M8 36 L8.8 34.8 L9.6 36 L10.8 35.2 L9.6 36 L10.4 37.2 L9.2 36.4 L8.4 37.2 L7.6 36.4 L6.4 37.2 L7.2 36 L6 35.2 L7.2 36 Z" fill="#d946ef" opacity="0.5" />
      {/* Center glow */}
      <circle cx="24" cy="22" r="4" fill="url(#crv-splash1)" opacity="0.3" filter="url(#crv-blur)" />
    </svg>
  );
}

// ─── EQ: Interconnected people with empathy waves ────────────────────────
export function EQIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="eq-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="eq-person" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
        <filter id="eq-blur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#eq-glow)" />
      {/* Connection arcs */}
      <path d="M14 20 C18 14, 30 14, 34 20" stroke="#c4b5fd" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M14 28 C18 34, 30 34, 34 28" stroke="#c4b5fd" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M12 24 C16 20, 32 20, 36 24" stroke="#ddd6fe" strokeWidth="0.6" fill="none" opacity="0.25" />
      {/* Person 1 (left) */}
      <circle cx="14" cy="18" r="4" fill="url(#eq-person)" />
      <circle cx="14" cy="18" r="2.5" fill="#ede9fe" opacity="0.5" />
      <circle cx="14" cy="26" r="3" fill="url(#eq-person)" opacity="0.7" />
      {/* Person 2 (right) */}
      <circle cx="34" cy="18" r="4" fill="url(#eq-person)" />
      <circle cx="34" cy="18" r="2.5" fill="#ede9fe" opacity="0.5" />
      <circle cx="34" cy="26" r="3" fill="url(#eq-person)" opacity="0.7" />
      {/* Center shared heart/connection */}
      <circle cx="24" cy="24" r="5" fill="url(#eq-person)" filter="url(#eq-blur)" opacity="0.25" />
      <circle cx="24" cy="24" r="4" fill="url(#eq-person)" />
      <circle cx="24" cy="24" r="2.5" fill="#ede9fe" opacity="0.6" />
      {/* Empathy wave rings */}
      <circle cx="24" cy="24" r="8" stroke="#c4b5fd" strokeWidth="0.5" fill="none" opacity="0.2" />
      <circle cx="24" cy="24" r="12" stroke="#ddd6fe" strokeWidth="0.4" fill="none" opacity="0.15" />
      <circle cx="24" cy="24" r="16" stroke="#ede9fe" strokeWidth="0.3" fill="none" opacity="0.1" />
      {/* Small floating emotion dots */}
      <circle cx="20" cy="12" r="0.8" fill="#ede9fe" opacity="0.7" />
      <circle cx="28" cy="12" r="0.8" fill="#ddd6fe" opacity="0.7" />
      <circle cx="10" cy="34" r="0.7" fill="#c4b5fd" opacity="0.5" />
      <circle cx="38" cy="34" r="0.7" fill="#c4b5fd" opacity="0.5" />
    </svg>
  );
}

// ─── MEMORY MATCH GAME: Overlapping translucent cards ─────────────────────
export function MemoryMatchIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mm-card1" x1="6" y1="8" x2="28" y2="40">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="mm-card2" x1="20" y1="8" x2="42" y2="40">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
        <filter id="mm-blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      {/* Back card */}
      <rect x="20" y="10" width="20" height="28" rx="4" fill="url(#mm-card2)" opacity="0.6" />
      <rect x="20" y="10" width="20" height="28" rx="4" stroke="#e879f9" strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="30" cy="22" r="3" fill="#fdf4ff" opacity="0.3" />
      <text x="30" y="24" textAnchor="middle" fill="#fdf4ff" fontSize="8" fontWeight="bold" opacity="0.5">?</text>
      {/* Front card (flipped) */}
      <rect x="6" y="14" width="20" height="28" rx="4" fill="url(#mm-card1)" opacity="0.8" />
      <rect x="6" y="14" width="20" height="28" rx="4" stroke="#fda4af" strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Brain icon on front card */}
      <circle cx="16" cy="26" r="5" fill="#fecdd3" opacity="0.4" filter="url(#mm-blur)" />
      <circle cx="16" cy="26" r="4" fill="#fecdd3" opacity="0.6" />
      <text x="16" y="28.5" textAnchor="middle" fill="#fff1f2" fontSize="10">🧠</text>
      {/* Match sparkle */}
      <circle cx="16" cy="26" r="7" stroke="#fda4af" strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Floating question marks */}
      <text x="36" y="16" fill="#f0abfc" fontSize="6" opacity="0.4">?</text>
      <text x="38" y="36" fill="#e879f9" fontSize="5" opacity="0.3">?</text>
    </svg>
  );
}

// ─── NUMBER SEQUENCE GAME: Flowing number matrix stream ──────────────────
export function NumberSequenceIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ns-stream" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <radialGradient id="ns-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#ns-glow)" />
      {/* Number grid background */}
      <text x="6" y="14" fill="#7dd3fc" fontSize="5" fontFamily="monospace" opacity="0.2">01101</text>
      <text x="28" y="12" fill="#38bdf8" fontSize="5" fontFamily="monospace" opacity="0.25">10110</text>
      <text x="4" y="22" fill="#0ea5e9" fontSize="5" fontFamily="monospace" opacity="0.2">10011</text>
      <text x="30" y="20" fill="#7dd3fc" fontSize="5" fontFamily="monospace" opacity="0.2">01101</text>
      <text x="6" y="38" fill="#38bdf8" fontSize="5" fontFamily="monospace" opacity="0.15">11010</text>
      <text x="30" y="36" fill="#0ea5e9" fontSize="5" fontFamily="monospace" opacity="0.2">10110</text>
      {/* Flowing number sequence */}
      <text x="8" y="18" fill="#bae6fd" fontSize="7" fontWeight="bold" fontFamily="monospace" opacity="0.4">3</text>
      <text x="16" y="16" fill="#7dd3fc" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.6">8</text>
      <text x="24" y="20" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" opacity="0.8">1</text>
      <text x="32" y="18" fill="#0ea5e9" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.7">5</text>
      <text x="38" y="22" fill="#0284c7" fontSize="7" fontWeight="bold" fontFamily="monospace" opacity="0.5">9</text>
      {/* Connecting flow line */}
      <path d="M10 16 Q16 12, 18 14 Q22 18, 26 17 Q30 14, 34 16 Q38 18, 40 20" stroke="url(#ns-stream)" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Highlight circle on active number */}
      <circle cx="26" cy="17" r="5" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="26" cy="17" r="5" fill="#0ea5e9" opacity="0.1" />
      {/* Grid dots */}
      <circle cx="10" cy="30" r="1" fill="#7dd3fc" opacity="0.3" />
      <circle cx="18" cy="32" r="1" fill="#38bdf8" opacity="0.25" />
      <circle cx="26" cy="30" r="1" fill="#0ea5e9" opacity="0.3" />
      <circle cx="34" cy="32" r="1" fill="#7dd3fc" opacity="0.25" />
      <circle cx="10" cy="40" r="1" fill="#38bdf8" opacity="0.2" />
      <circle cx="26" cy="42" r="1" fill="#0ea5e9" opacity="0.2" />
      <circle cx="38" cy="40" r="1" fill="#7dd3fc" opacity="0.2" />
    </svg>
  );
}

// ─── WORD SCRAMBLE GAME: Floating 3D scattered letters ───────────────────
export function WordScrambleIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ws-letter" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="ws-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <filter id="ws-blur">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#ws-glow)" />
      {/* Scattered background letters */}
      <text x="4" y="14" fill="#fde68a" fontSize="6" fontWeight="bold" opacity="0.2" transform="rotate(-20 6 14)">X</text>
      <text x="36" y="12" fill="#fbbf24" fontSize="5" fontWeight="bold" opacity="0.15" transform="rotate(15 36 12)">Z</text>
      <text x="6" y="38" fill="#f59e0b" fontSize="5" fontWeight="bold" opacity="0.15" transform="rotate(10 6 38)">Q</text>
      <text x="38" y="40" fill="#fde68a" fontSize="5" fontWeight="bold" opacity="0.2" transform="rotate(-10 38 40)">W</text>
      <text x="40" y="20" fill="#fbbf24" fontSize="4" fontWeight="bold" opacity="0.15" transform="rotate(25 40 20)">J</text>
      {/* Main scattered word letters with depth */}
      <text x="8" y="22" fill="url(#ws-letter)" fontSize="12" fontWeight="bold" opacity="0.7" transform="rotate(-8 8 22)">B</text>
      <text x="18" y="18" fill="url(#ws-letter)" fontSize="13" fontWeight="bold" opacity="0.85" transform="rotate(5 18 18)">R</text>
      <text x="28" y="24" fill="url(#ws-letter)" fontSize="11" fontWeight="bold" opacity="0.65" transform="rotate(-12 28 24)">A</text>
      <text x="14" y="34" fill="url(#ws-letter)" fontSize="12" fontWeight="bold" opacity="0.75" transform="rotate(8 14 34)">I</text>
      <text x="30" y="36" fill="url(#ws-letter)" fontSize="10" fontWeight="bold" opacity="0.55" transform="rotate(-6 30 36)">N</text>
      {/* Shadow/glow under letters */}
      <ellipse cx="16" cy="24" rx="4" ry="1.5" fill="#d97706" opacity="0.1" filter="url(#ws-blur)" />
      <ellipse cx="26" cy="20" rx="4" ry="1.5" fill="#d97706" opacity="0.08" filter="url(#ws-blur)" />
      {/* Connecting scramble lines */}
      <path d="M12 20 C16 24, 22 16, 26 18" stroke="#fde68a" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="2 2" />
      <path d="M22 20 C26 26, 30 20, 32 24" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.25" strokeDasharray="2 2" />
    </svg>
  );
}

// ─── REACTION SPEED GAME: Lightning bolt with speed lines ─────────────────
export function ReactionSpeedIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rs-bolt" x1="16" y1="4" x2="32" y2="44">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <radialGradient id="rs-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="rs-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#rs-glow)" />
      {/* Speed lines */}
      <line x1="4" y1="14" x2="14" y2="16" stroke="#86efac" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <line x1="4" y1="20" x2="12" y2="21" stroke="#4ade80" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <line x1="4" y1="26" x2="14" y2="26" stroke="#86efac" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
      <line x1="34" y1="12" x2="44" y2="10" stroke="#86efac" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <line x1="36" y1="18" x2="44" y2="17" stroke="#4ade80" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <line x1="34" y1="24" x2="44" y2="24" stroke="#86efac" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
      {/* Main lightning bolt */}
      <polygon points="28,4 16,24 22,24 18,44 34,20 26,20 30,4" fill="url(#rs-bolt)" opacity="0.85" />
      {/* Bolt glow */}
      <polygon points="28,4 16,24 22,24 18,44 34,20 26,20 30,4" fill="#86efac" filter="url(#rs-blur)" opacity="0.25" />
      {/* Bolt highlight */}
      <polygon points="27,8 19,22 23,22 20,38 31,21 27,21 29,8" fill="#bbf7d0" opacity="0.3" />
      {/* Energy sparks */}
      <circle cx="14" cy="24" r="1" fill="#bbf7d0" opacity="0.6" />
      <circle cx="34" cy="20" r="1" fill="#86efac" opacity="0.6" />
      <circle cx="18" cy="40" r="0.8" fill="#4ade80" opacity="0.5" />
      {/* Afterimage echoes */}
      <polygon points="26,6 16,22 20,22 17,40 30,20 24,20 28,6" fill="#86efac" opacity="0.1" />
    </svg>
  );
}

// ─── COLOR MATCH GAME: Prismatic color wheel with spectrum ────────────────
export function ColorMatchIllustration({ className = "h-8 w-8" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cm-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="cm-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="cm-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="cm-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="cm-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" /><stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#cm-glow)" />
      {/* Outer ring segments */}
      <circle cx="24" cy="24" r="18" stroke="#c084fc" strokeWidth="3" fill="none" opacity="0.2"
        strokeDasharray="11.3 56.5" strokeDashoffset="0" />
      <circle cx="24" cy="24" r="18" stroke="#f87171" strokeWidth="3" fill="none" opacity="0.3"
        strokeDasharray="11.3 56.5" strokeDashoffset="-11.3" />
      <circle cx="24" cy="24" r="18" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.3"
        strokeDasharray="11.3 56.5" strokeDashoffset="-22.6" />
      <circle cx="24" cy="24" r="18" stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.3"
        strokeDasharray="11.3 56.5" strokeDashoffset="-33.9" />
      <circle cx="24" cy="24" r="18" stroke="#60a5fa" strokeWidth="3" fill="none" opacity="0.3"
        strokeDasharray="11.3 56.5" strokeDashoffset="-45.2" />
      <circle cx="24" cy="24" r="18" stroke="#c084fc" strokeWidth="3" fill="none" opacity="0.25"
        strokeDasharray="11.3 56.5" strokeDashoffset="-56.5" />
      {/* Inner color dots */}
      <circle cx="24" cy="10" r="3.5" fill="url(#cm-red)" opacity="0.8" />
      <circle cx="36" cy="18" r="3.5" fill="url(#cm-yellow)" opacity="0.8" />
      <circle cx="34" cy="34" r="3.5" fill="url(#cm-green)" opacity="0.8" />
      <circle cx="14" cy="34" r="3.5" fill="url(#cm-blue)" opacity="0.8" />
      <circle cx="12" cy="18" r="3.5" fill="url(#cm-purple)" opacity="0.8" />
      {/* Center */}
      <circle cx="24" cy="24" r="5" fill="#7c3aed" opacity="0.3" />
      <circle cx="24" cy="24" r="3.5" fill="#c084fc" opacity="0.5" />
      <circle cx="24" cy="24" r="2" fill="#e9d5ff" opacity="0.7" />
      {/* Connecting lines */}
      <line x1="24" y1="10" x2="24" y2="21" stroke="#c084fc" strokeWidth="0.5" opacity="0.3" />
      <line x1="36" y1="18" x2="27" y2="22" stroke="#fde047" strokeWidth="0.5" opacity="0.3" />
      <line x1="34" y1="34" x2="27" y2="27" stroke="#4ade80" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="34" x2="21" y2="27" stroke="#60a5fa" strokeWidth="0.5" opacity="0.3" />
      <line x1="12" y1="18" x2="21" y2="22" stroke="#c084fc" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

// ─── EXPORT MAP ────────────────────────────────────────────────────────────
export const CATEGORY_ILLUSTRATIONS: Record<string, React.ComponentType<IllustrationProps>> = {
  memory: MemoryIllustration,
  focus: FocusIllustration,
  thinking: ThinkingIllustration,
  learning: LearningIllustration,
  health: HealthIllustration,
  creativity: CreativityIllustration,
  "emotional-intelligence": EQIllustration,
};

export const GAME_ILLUSTRATIONS: Record<string, React.ComponentType<IllustrationProps>> = {
  memory_match: MemoryMatchIllustration,
  number_sequence: NumberSequenceIllustration,
  word_scramble: WordScrambleIllustration,
  reaction_speed: ReactionSpeedIllustration,
  color_match: ColorMatchIllustration,
};
