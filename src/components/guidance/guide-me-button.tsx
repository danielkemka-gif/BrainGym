"use client";

import { useState } from "react";
import { HelpCircle, Compass } from "lucide-react";
import { GuideMeModal } from "./guide-me-modal";

interface GuideMeButtonProps {
  className?: string;
  variant?: "floating" | "inline";
}

export function GuideMeButton({ className = "", variant = "inline" }: GuideMeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "floating") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition ${className}`}
          title="What should I do? / Guide Me"
        >
          <Compass className="h-6 w-6 animate-spin-slow" />
        </button>

        <GuideMeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3 py-1 text-xs font-bold text-primary transition active:scale-95 ${className}`}
      >
        <Compass className="h-3.5 w-3.5" />
        <span>Guide Me</span>
      </button>

      <GuideMeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
