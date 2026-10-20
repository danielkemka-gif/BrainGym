"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export type KucheAnimationState =
  | "idle"
  | "welcome"
  | "explain"
  | "encourage"
  | "success"
  | "thinking"
  | "hidden";

export interface KucheCharacterProps {
  state?: KucheAnimationState;
  size?: "sm" | "md" | "lg" | "xl";
  pointingDirection?: "left" | "right" | "up" | "down";
  reducedMotion?: boolean;
  className?: string;
  onClick?: () => void;
}

export function KucheCharacter({
  state = "idle",
  size = "md",
  pointingDirection = "right",
  reducedMotion = false,
  className = "",
  onClick,
}: KucheCharacterProps) {
  // Natural periodic blinking in idle state
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (reducedMotion || state === "hidden") return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion, state]);

  // Size mapping in pixels
  const sizeMap = {
    sm: { width: 56, height: 63 },
    md: { width: 96, height: 108 },
    lg: { width: 140, height: 158 },
    xl: { width: 180, height: 202 },
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  if (state === "hidden") {
    return null;
  }

  // Animation variants for the whole character container
  const containerVariants: Variants = {
    idle: {
      y: reducedMotion ? 0 : [0, -3, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const },
    },
    welcome: {
      y: reducedMotion ? 0 : [0, -2, 0],
      rotate: reducedMotion ? 0 : [0, -1, 1, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const },
    },
    explain: {
      y: 0,
      rotate: pointingDirection === "left" ? -2 : 2,
      transition: { duration: 0.3 },
    },
    encourage: {
      y: reducedMotion ? 0 : [0, -4, 0],
      scale: reducedMotion ? 1 : [1, 1.02, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
    },
    success: {
      y: reducedMotion ? 0 : [0, -8, 0, -5, 0],
      scale: reducedMotion ? 1 : [1, 1.06, 0.98, 1.02, 1],
      transition: { duration: 1.2, repeat: Infinity, repeatDelay: 1 },
    },
    thinking: {
      y: 0,
      rotate: reducedMotion ? 0 : [-2, -2.5, -2],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    hidden: { scale: 0, opacity: 0 },
  };

  // Right arm gestures
  const rightArmVariants: Variants = {
    idle: {
      rotate: 0,
      y: 0,
      x: 0,
      transition: { duration: 0.4 },
    },
    welcome: {
      rotate: reducedMotion ? 0 : [-10, 18, -12, 14, 0],
      y: -8,
      x: 2,
      transition: { duration: 1.6, repeat: Infinity, repeatDelay: 0.6 },
    },
    explain: {
      rotate: pointingDirection === "left" ? -35 : 25,
      y: -6,
      x: pointingDirection === "left" ? -4 : 6,
      transition: { type: "spring" as const, stiffness: 220, damping: 18 },
    },
    encourage: {
      rotate: 15,
      y: -10,
      x: 4,
      transition: { type: "spring" as const, stiffness: 260, damping: 15 },
    },
    success: {
      rotate: reducedMotion ? 0 : [20, 35, 20],
      y: -14,
      x: 6,
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
    },
    thinking: {
      rotate: -12,
      y: -16,
      x: -6,
      transition: { type: "spring" as const, stiffness: 200, damping: 20 },
    },
  };

  // Head tilt variants
  const headVariants: Variants = {
    idle: { rotate: 0 },
    welcome: { rotate: 2 },
    explain: { rotate: pointingDirection === "left" ? -3 : 3 },
    encourage: { rotate: [0, 2, 0] },
    success: { rotate: [0, -2, 2, 0] },
    thinking: { rotate: -4 },
  };

  // Spark ("Uche Spark") animation
  const sparkVariants: Variants = {
    idle: {
      y: reducedMotion ? 0 : [0, -4, 0],
      scale: [1, 1.08, 1],
      opacity: [0.85, 1, 0.85],
      transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
    },
    welcome: {
      scale: [1, 1.25, 1],
      rotate: [0, 90, 180],
      transition: { duration: 2, repeat: Infinity },
    },
    explain: {
      x: pointingDirection === "left" ? -10 : 10,
      scale: [1, 1.15, 1],
      transition: { duration: 1.5, repeat: Infinity },
    },
    encourage: {
      scale: [1, 1.3, 1],
      opacity: [0.9, 1, 0.9],
      transition: { duration: 1.6, repeat: Infinity },
    },
    success: {
      y: [-6, -14, -6],
      scale: [1.1, 1.45, 1.1],
      rotate: [0, 180, 360],
      transition: { duration: 1.2, repeat: Infinity },
    },
    thinking: {
      rotate: [0, 360],
      x: [-3, 3, -3],
      y: [-2, 2, -2],
      transition: { duration: 4, repeat: Infinity, ease: "linear" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={state}
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        filter: "drop-shadow(0 8px 16px rgba(4, 47, 36, 0.15))",
      }}
      role="img"
      aria-label={`Akuche guide character in ${state} state`}
    >
      <svg
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Skin Gradients - Warm Terracotta/Bronze */}
          <linearGradient id="kuche-skin" x1="80" y1="35" x2="80" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#693B26" />
            <stop offset="65%" stopColor="#532E1D" />
            <stop offset="100%" stopColor="#412316" />
          </linearGradient>

          <linearGradient id="kuche-skin-light" x1="60" y1="35" x2="100" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7B4931" />
            <stop offset="100%" stopColor="#5A3220" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="kuche-hair" x1="80" y1="18" x2="80" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#251B17" />
            <stop offset="60%" stopColor="#1B1310" />
            <stop offset="100%" stopColor="#120C0A" />
          </linearGradient>

          {/* High-Collar Emerald Jacket */}
          <linearGradient id="kuche-coat" x1="40" y1="105" x2="120" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B4F3A" />
            <stop offset="50%" stopColor="#073B2B" />
            <stop offset="100%" stopColor="#04271C" />
          </linearGradient>

          {/* Jade Accent Trim */}
          <linearGradient id="kuche-jade" x1="70" y1="110" x2="90" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Gold Chevrons & Spark */}
          <linearGradient id="kuche-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Soft Glow Radial */}
          <radialGradient id="kuche-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#042F24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ─── 1. SOFT AMBIENT AURA (Encourage / Success) ─── */}
        {(state === "encourage" || state === "success") && (
          <motion.circle
            cx="80"
            cy="80"
            r="65"
            fill="url(#kuche-glow)"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* ─── 2. THE SPARK OF CLARITY ("Uche Spark") ─── */}
        <motion.g
          variants={sparkVariants}
          animate={state}
          style={{ transformOrigin: "125px 35px" }}
        >
          {/* Outer glow ring */}
          <circle cx="125" cy="35" r="14" fill="#FBBF24" fillOpacity="0.18" />
          {/* Radiant 8-pointed gold starburst */}
          <path
            d="M125 24L127.2 32.5L136 35L127.2 37.5L125 46L122.8 37.5L114 35L122.8 32.5Z"
            fill="url(#kuche-gold)"
          />
          {/* Center core */}
          <circle cx="125" cy="35" r="2.8" fill="#FFFBEB" />

          {/* Mini sparkle particles in success state */}
          {state === "success" && (
            <>
              <motion.circle
                cx="138"
                cy="22"
                r="1.8"
                fill="#34D399"
                animate={{ y: [-2, -8], opacity: [1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <motion.circle
                cx="115"
                cy="20"
                r="1.5"
                fill="#FBBF24"
                animate={{ y: [-2, -7], opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
              />
            </>
          )}

          {/* Orbiting thought dots in thinking state */}
          {state === "thinking" && (
            <>
              <motion.circle
                cx="118"
                cy="44"
                r="1.6"
                fill="#FBBF24"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.circle
                cx="110"
                cy="50"
                r="2.2"
                fill="#FBBF24"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="102"
                cy="56"
                r="2.8"
                fill="#FBBF24"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
              />
            </>
          )}
        </motion.g>

        {/* ─── 3. BODY & TAILORED HIGH-COLLAR JACKET ─── */}
        <g id="kuche-body">
          {/* Shoulders and Coat Base */}
          <path
            d="M32 178C32 142 50 120 70 114L80 122L90 114C110 120 128 142 128 178H32Z"
            fill="url(#kuche-coat)"
          />

          {/* Inner Jade V-Neck Trim */}
          <path
            d="M70 114L80 138L90 114L86 112L80 128L74 112Z"
            fill="url(#kuche-jade)"
          />

          {/* Geometric Gold Lapel Clasp (Akuche Chevron) */}
          <path
            d="M76 137L80 144L84 137L80 133Z"
            fill="url(#kuche-gold)"
          />

          {/* Subtle Coat Lapel Folds */}
          <path
            d="M58 126C65 138 72 152 74 178"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="M102 126C95 138 88 152 86 178"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
        </g>

        {/* ─── 4. LEFT ARM (Rests elegantly) ─── */}
        <g id="kuche-arm-left">
          <path
            d="M38 125C30 138 28 155 34 175"
            stroke="#0B4F3A"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="34" cy="172" r="5" fill="url(#kuche-skin)" />
        </g>

        {/* ─── 5. HEAD & FACIAL GROUP ─── */}
        <motion.g
          id="kuche-head-group"
          variants={headVariants}
          animate={state}
          style={{ transformOrigin: "80px 85px" }}
        >
          {/* Neck */}
          <path
            d="M72 90H88V115C88 119 84 122 80 122C76 122 72 119 72 115V90Z"
            fill="url(#kuche-skin)"
          />
          {/* Neck shadow */}
          <path
            d="M72 90C76 96 84 96 88 90V97C88 103 84 106 80 106C76 106 72 103 72 97V90Z"
            fill="#3B1E12"
            fillOpacity="0.35"
          />

          {/* Ears with subtle geometric gold studs */}
          <path
            d="M48 64C45 64 43 68 43 73C43 78 46 82 49 82L51 78V66L48 64Z"
            fill="url(#kuche-skin)"
          />
          <circle cx="46" cy="76" r="1.5" fill="url(#kuche-gold)" />

          <path
            d="M112 64C115 64 117 68 117 73C117 78 114 82 111 82L109 78V66L112 64Z"
            fill="url(#kuche-skin)"
          />
          <circle cx="114" cy="76" r="1.5" fill="url(#kuche-gold)" />

          {/* Head & Face Contour */}
          <path
            d="M50 56C50 36 62 26 80 26C98 26 110 36 110 56C110 78 98 96 80 96C62 96 50 78 50 56Z"
            fill="url(#kuche-skin)"
          />

          {/* Stylized Contemporary Hair / Geometric Crown */}
          <path
            d="M49 52C47 34 60 20 80 20C100 20 113 34 111 52C108 34 98 28 80 28C62 28 52 34 49 52Z"
            fill="url(#kuche-hair)"
          />
          {/* Textured hairline detail */}
          <path
            d="M52 48C56 36 67 31 80 31C93 31 104 36 108 48C104 40 94 36 80 36C66 36 56 40 52 48Z"
            fill="#2D1F1A"
          />

          {/* Soft Forehead & Cheek Highlights */}
          <ellipse cx="80" cy="46" rx="14" ry="6" fill="url(#kuche-skin-light)" fillOpacity="0.45" />
          <ellipse cx="61" cy="70" rx="5" ry="3" fill="#8C5338" fillOpacity="0.25" />
          <ellipse cx="99" cy="70" rx="5" ry="3" fill="#8C5338" fillOpacity="0.25" />

          {/* Eyebrows */}
          <path
            d={
              state === "thinking"
                ? "M60 55C65 52 70 54 74 57"
                : state === "explain"
                ? "M60 54C65 51 71 52 74 54"
                : "M60 54C65 51 70 51 74 53"
            }
            stroke="#1B1310"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d={
              state === "thinking"
                ? "M86 57C90 54 95 53 100 55"
                : state === "explain"
                ? "M86 53C89 51 95 50 100 52"
                : "M86 53C90 51 95 51 100 54"
            }
            stroke="#1B1310"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Eyes Group */}
          <g id="kuche-eyes">
            {/* Left Eye */}
            {isBlinking || state === "success" ? (
              // Closed smiling arc eye
              <path
                d="M62 64C66 68 70 68 74 64"
                stroke="#1B1310"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : (
              // Open Almond Eye
              <g>
                <path
                  d="M61 64C64 60 71 60 74 64C71 67 64 67 61 64Z"
                  fill="#FFFDF7"
                />
                {/* Iris (Warm Amber / Hazel) */}
                <circle
                  cx={
                    state === "thinking"
                      ? 69
                      : state === "explain" && pointingDirection === "left"
                      ? 65
                      : 67.5
                  }
                  cy={state === "thinking" ? 62.5 : 63.5}
                  r="2.6"
                  fill="#B45309"
                />
                {/* Pupil */}
                <circle
                  cx={
                    state === "thinking"
                      ? 69
                      : state === "explain" && pointingDirection === "left"
                      ? 65
                      : 67.5
                  }
                  cy={state === "thinking" ? 62.5 : 63.5}
                  r="1.4"
                  fill="#0F0A08"
                />
                {/* Light Sparkle Reflection */}
                <circle cx="68.5" cy="62.5" r="0.7" fill="#FFFFFF" />
              </g>
            )}

            {/* Right Eye */}
            {isBlinking || state === "success" ? (
              <path
                d="M86 64C90 68 94 68 98 64"
                stroke="#1B1310"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : (
              <g>
                <path
                  d="M86 64C89 60 96 60 99 64C96 67 89 67 86 64Z"
                  fill="#FFFDF7"
                />
                {/* Iris */}
                <circle
                  cx={
                    state === "thinking"
                      ? 94
                      : state === "explain" && pointingDirection === "left"
                      ? 90
                      : 92.5
                  }
                  cy={state === "thinking" ? 62.5 : 63.5}
                  r="2.6"
                  fill="#B45309"
                />
                {/* Pupil */}
                <circle
                  cx={
                    state === "thinking"
                      ? 94
                      : state === "explain" && pointingDirection === "left"
                      ? 90
                      : 92.5
                  }
                  cy={state === "thinking" ? 62.5 : 63.5}
                  r="1.4"
                  fill="#0F0A08"
                />
                {/* Light Sparkle Reflection */}
                <circle cx="93.5" cy="62.5" r="0.7" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* Gentle Sculpted Nose */}
          <path
            d="M79 64V73C79 74.5 77.5 75.5 80 75.5C82.5 75.5 81 74.5 81 73V64"
            stroke="#452316"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Mouth */}
          {state === "welcome" || state === "encourage" || state === "success" ? (
            // Warm open inviting smile with tooth highlight
            <g>
              <path
                d="M71 81C74 87 86 87 89 81Z"
                fill="#2E160D"
              />
              <path
                d="M73 81.8C75 83.5 85 83.5 87 81.8Z"
                fill="#FFFDF7"
              />
              <path
                d="M70 81C74 88 86 88 90 81"
                stroke="#2E160D"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          ) : state === "thinking" ? (
            // Pensive gentle mouth curve
            <path
              d="M73 82C77 81.5 83 81.5 86 82.5"
              stroke="#2E160D"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            // Ambient calm closed smile (Idle / Explain)
            <path
              d="M72 81C76 84.5 84 84.5 88 81"
              stroke="#2E160D"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </motion.g>

        {/* ─── 6. RIGHT ARM (Articulated for Wave, Point, Thumbs-up, Thinking) ─── */}
        <motion.g
          id="kuche-arm-right"
          variants={rightArmVariants}
          animate={state}
          style={{ transformOrigin: "122px 125px" }}
        >
          {state === "thinking" ? (
            // Hand brought up to chin
            <g>
              <path
                d="M122 125C118 108 108 92 88 88"
                stroke="#0B4F3A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Hand resting on chin */}
              <circle cx="88" cy="88" r="5" fill="url(#kuche-skin)" />
              <path
                d="M86 85C86 81 89 82 90 85"
                stroke="#452316"
                strokeWidth="1.2"
              />
            </g>
          ) : state === "explain" ? (
            // Hand pointing with index finger
            <g>
              <path
                d={
                  pointingDirection === "left"
                    ? "M118 125C100 120 70 118 50 110"
                    : "M122 125C132 122 144 115 152 108"
                }
                stroke="#0B4F3A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Hand with extended index finger */}
              <circle
                cx={pointingDirection === "left" ? 48 : 154}
                cy={pointingDirection === "left" ? 110 : 106}
                r="5.5"
                fill="url(#kuche-skin)"
              />
              {/* Directional beam / glow pulse */}
              <motion.circle
                cx={pointingDirection === "left" ? 44 : 158}
                cy={pointingDirection === "left" ? 110 : 104}
                r="3.5"
                fill="#FBBF24"
                animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </g>
          ) : state === "encourage" ? (
            // Thumbs-up gesture
            <g>
              <path
                d="M122 125C130 115 134 102 130 90"
                stroke="#0B4F3A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <circle cx="130" cy="88" r="5.5" fill="url(#kuche-skin)" />
              {/* Upright thumb */}
              <path
                d="M130 88V80"
                stroke="url(#kuche-skin)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>
          ) : state === "welcome" ? (
            // Raised waving hand
            <g>
              <path
                d="M122 125C132 110 138 92 134 76"
                stroke="#0B4F3A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Open waving palm */}
              <circle cx="134" cy="74" r="6" fill="url(#kuche-skin)" />
              {/* Extended fingers */}
              <path
                d="M131 71L128 64M134 69L134 62M137 70L139 63M139 72L143 66"
                stroke="url(#kuche-skin)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ) : state === "success" ? (
            // Triumphant raised salute
            <g>
              <path
                d="M122 125C134 105 142 80 142 62"
                stroke="#0B4F3A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <circle cx="142" cy="60" r="6" fill="url(#kuche-skin)" />
            </g>
          ) : (
            // Resting naturally at side (Idle)
            <g>
              <path
                d="M122 125C130 138 132 155 126 175"
                stroke="#0B4F3A"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="126" cy="172" r="5" fill="url(#kuche-skin)" />
            </g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
