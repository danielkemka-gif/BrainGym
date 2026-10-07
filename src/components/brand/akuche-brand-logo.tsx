"use client";

import React from "react";
import Link from "next/link";

export interface AkucheBrandLogoProps {
  variant?: "mark" | "horizontal" | "full" | "badge";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
  href?: string;
  animate?: boolean;
}

export function AkucheBrandLogo({
  variant = "horizontal",
  size = "md",
  className = "",
  showTagline = false,
  href,
  animate = false,
}: AkucheBrandLogoProps) {
  // Size mappings in pixels
  const sizeMap = {
    xs: { mark: 22, text: "text-xs", gap: "gap-1.5" },
    sm: { mark: 28, text: "text-sm", gap: "gap-2" },
    md: { mark: 36, text: "text-base", gap: "gap-2.5" },
    lg: { mark: 48, text: "text-xl", gap: "gap-3" },
    xl: { mark: 64, text: "text-2xl", gap: "gap-4" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // The Master Vector Icon: Abstract Emerald "A" + Human Growth Form + Radiant Gold Spark
  const renderMark = () => (
    <svg
      width={currentSize.mark}
      height={currentSize.mark}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${animate ? "hover:scale-105" : ""}`}
      aria-label="Akuche Logo Mark"
    >
      <defs>
        {/* Emerald to Jade primary gradient */}
        <linearGradient id="akuche-emerald" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Warm Gold / Amber radiant spark gradient */}
        <linearGradient id="akuche-gold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Soft Inner Glow */}
        <linearGradient id="akuche-glow" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#065f46" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Rounded subtle backdrop pill container for perfect contrast */}
      <rect width="48" height="48" rx="12" fill="#042F24" fillOpacity="0.85" />
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="11.5"
        stroke="#10b981"
        strokeOpacity="0.25"
      />

      {/* Left ascending arch of the "A" */}
      <path
        d="M13 36L22.2 14.8C22.8 13.4 24.8 13.4 25.4 14.8L34.6 36C35.1 37.2 34.2 38.5 32.9 38.5H30.5C29.7 38.5 29 38 28.7 37.3L26.6 32H20.9L18.8 37.3C18.5 38 17.8 38.5 17 38.5H14.7C13.4 38.5 12.5 37.2 13 36Z"
        fill="url(#akuche-emerald)"
      />

      {/* Inner upward chevron / human growth apex representing Uche (thought & intentional wisdom) */}
      <path
        d="M23.75 18L27.5 26.5H20L23.75 18Z"
        fill="#042F24"
        fillOpacity="0.95"
      />

      {/* Center Action Crossbar connecting learning to execution */}
      <path
        d="M19 28.5H28.5C29.3 28.5 30 29.2 30 30C30 30.8 29.3 31.5 28.5 31.5H19C18.2 31.5 17.5 30.8 17.5 30C17.5 29.2 18.2 28.5 19 28.5Z"
        fill="#34d399"
      />

      {/* Crown Radiant Spark — the golden illumination of clarity (*Ako*) */}
      <circle cx="23.75" cy="8.5" r="3.2" fill="url(#akuche-gold)" />
      <path
        d="M23.75 3.5V5.5M23.75 11.5V13.5M18.75 8.5H20.75M26.75 8.5H28.75"
        stroke="#fbbf24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );

  const renderContent = () => {
    if (variant === "mark") {
      return renderMark();
    }

    if (variant === "badge") {
      return (
        <div className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 backdrop-blur-md ${className}`}>
          {renderMark()}
          <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">AKUCHE</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center ${currentSize.gap} ${className}`}>
        {renderMark()}
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-foreground ${currentSize.text} uppercase flex items-center gap-1`}>
            <span>AKUCHE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          </span>
          {(showTagline || variant === "full") && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400/80 tracking-wider mt-0.5">
              Think Better · Decide Better
            </span>
          )}
        </div>
      </div>
    );
  };

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition opacity-95 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {renderContent()}
      </Link>
    );
  }

  return renderContent();
}
