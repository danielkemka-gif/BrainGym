"use client";

import Link from "next/link";
import { Swords, MessageCircle, Scale, Gamepad2, ArrowRight } from "lucide-react";

export function QuickExploreTiles() {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Explore Arena &amp; Tools
        </h3>
        <span className="text-[11px] text-muted-foreground font-medium">177+ Drills</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/dashboard/challenges"
          className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/50 p-3 transition active:scale-[0.98] min-h-[90px] touch-manipulation group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
              <Swords className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-black text-foreground">1v1 Brain Duel</p>
            <p className="text-[10px] text-muted-foreground">Live 2-Player Arena</p>
          </div>
        </Link>

        <Link
          href="/dashboard/library"
          className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/50 p-3 transition active:scale-[0.98] min-h-[90px] touch-manipulation group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-black text-foreground">Level Gated Library</p>
            <p className="text-[10px] text-muted-foreground">Unlock 177+ Drills</p>
          </div>
        </Link>

        <Link
          href="/dashboard/decision-lab"
          className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/50 p-3 transition active:scale-[0.98] min-h-[90px] touch-manipulation group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Scale className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-black text-foreground">Decision Lab</p>
            <p className="text-[10px] text-muted-foreground">Cognitive Biases</p>
          </div>
        </Link>

        <Link
          href="/dashboard/chat"
          className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/50 p-3 transition active:scale-[0.98] min-h-[90px] touch-manipulation group"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-black text-foreground">Thinker Chat</p>
            <p className="text-[10px] text-muted-foreground">Connect with Thinkers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
