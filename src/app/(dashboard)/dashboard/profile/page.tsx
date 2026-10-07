"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import {
  getMemoryItems,
  saveMemoryItem,
  updateMemoryItem,
  deleteMemoryItem,
  isMemoryEnabled,
  setMemoryEnabled,
  calculateActionStreak,
  getPersonalInsights,
  AkucheMemoryItem,
  AkuchePersonalInsight,
} from "@/lib/akuche/memory-engine";
import { getDecisionRecords, AkucheDecisionRecord } from "@/lib/akuche/decisions-engine";
import { ContextualGuidanceBanner } from "@/components/layout/contextual-guidance-banner";
import { Avatar } from "@/components/ui/avatar";
import { AppInstallCard } from "@/components/dashboard/app-install-card";
import {
  Brain,
  Shield,
  Pencil,
  Trash2,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Compass,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Settings,
  Bell,
  LogOut,
  Target,
  User,
  RotateCcw,
} from "lucide-react";

export default function MyAkuchePage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [memoryItems, setMemoryItems] = useState<AkucheMemoryItem[]>([]);
  const [memoryActive, setMemoryActive] = useState(true);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 });
  const [decisions, setDecisions] = useState<AkucheDecisionRecord[]>([]);
  const [insights, setInsights] = useState<AkuchePersonalInsight[]>([]);
  const [profileData, setProfileData] = useState<{
    name: string;
    occupation: string;
    primaryFocus: string;
  }>({
    name: "Friend",
    occupation: "Professional / Entrepreneur",
    primaryFocus: "Financial & Business Growth",
  });

  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<AkucheMemoryItem["category"]>("goal");
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const refresh = () => {
    setMemoryItems(getMemoryItems());
    setMemoryActive(isMemoryEnabled());
    setStreakData(calculateActionStreak());
    setDecisions(getDecisionRecords());
    setInsights(getPersonalInsights());

    if (user) {
      supabase
        .from("profiles")
        .select("name, username")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data && data.name) {
            setProfileData((prev) => ({
              ...prev,
              name: data.name,
            }));
          } else if (user.user_metadata?.full_name) {
            setProfileData((prev) => ({
              ...prev,
              name: user.user_metadata.full_name,
            }));
          }
        });
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const handleToggleMemory = () => {
    const next = !memoryActive;
    setMemoryEnabled(next);
    setMemoryActive(next);
  };

  const handleAddMemory = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    saveMemoryItem({
      category: newCategory,
      title: newTitle,
      content: newContent,
      sourceContext: "Added directly from My Akuche command centre",
    });
    setNewTitle("");
    setNewContent("");
    setIsAddingMemory(false);
    refresh();
  };

  const handleSaveMemoryEdit = (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateMemoryItem(id, {
      title: editTitle,
      content: editContent,
    });
    setEditingMemoryId(null);
    refresh();
  };

  const handleDeleteMemory = (id: string) => {
    deleteMemoryItem(id);
    refresh();
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-28 touch-manipulation">
      <ContextualGuidanceBanner
        featureKey="profile"
        title="MY AKUCHE — Personal Command Centre"
        description="Review your growth trajectory, control what Akuche remembers about your goals and context, and manage your decision portfolio."
      />

      {/* ─── 1. USER IDENTITY CARD ─── */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-md">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  {profileData.name}
                </h1>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                  MY AKUCHE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.email || "Member"} · Active Growth Journey
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-3.5 py-2 shadow-xs">
              <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
              <div>
                <span className="text-xs font-black text-foreground block leading-none">
                  {streakData.currentStreak}-Day Action Streak
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {streakData.totalActionsCompleted} actions completed
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/settings"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground transition"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Cognitive & Life Dimensions Radar Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
              Socratic Focus
            </span>
            <span className="text-[11px] text-muted-foreground">High Precision</span>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
            <span className="text-xs font-black text-foreground block">
              {decisions.length} Decisions
            </span>
            <span className="text-[11px] text-muted-foreground">In Decision Lab</span>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
            <span className="text-xs font-black text-foreground block">
              {insights.length} Insights
            </span>
            <span className="text-[11px] text-muted-foreground">Patterns Unlocked</span>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
              Execution Math
            </span>
            <span className="text-[11px] text-muted-foreground">Active Trajectory</span>
          </div>
        </div>
      </div>

      {/* ─── APP INSTALL CARD (EASY MOBILE & HOME SCREEN ACCESS) ─── */}
      <AppInstallCard variant="banner" />

      {/* ─── 2. "WHAT AKUCHE KNOWS ABOUT ME" (TRANSPARENT MEMORY SECTION 21 & 48) ─── */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-4 w-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                What Akuche Knows About Me
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transparent, user-controlled memory used to personalize your thinking sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMemory}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                memoryActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {memoryActive ? "Memory: Enabled ✓" : "Memory: Disabled"}
            </button>

            <button
              onClick={() => setIsAddingMemory(!isAddingMemory)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Fact</span>
            </button>
          </div>
        </div>

        {/* Add Memory Fact Form */}
        {isAddingMemory && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2.5 animate-fade-in">
            <span className="text-xs font-bold text-foreground block">
              Add New Memory Fact for Akuche to Remember:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as AkucheMemoryItem["category"])
                }
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="goal">Goal (Target number, deadline, milestone)</option>
                <option value="profile">Profile (Occupation, skills, interests)</option>
                <option value="project">Project (Active business or personal venture)</option>
                <option value="decision">Decision (Key boundary or filter)</option>
                <option value="commitment">Commitment (Promise or quota)</option>
                <option value="pattern">Pattern (Observed strength or tendency)</option>
              </select>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (e.g. ₦5M Target by Q4)"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What should Akuche remember about this?"
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingMemory(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                disabled={!newTitle.trim() || !newContent.trim()}
                onClick={handleAddMemory}
                className="rounded-xl bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold shadow-xs disabled:opacity-40"
              >
                Save to Memory
              </button>
            </div>
          </div>
        )}

        {/* Memory Items List */}
        <div className="space-y-2.5">
          {memoryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/80 bg-background/60 p-3.5 space-y-1.5 hover:border-emerald-500/30 transition"
            >
              {editingMemoryId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none font-bold"
                  />
                  <textarea
                    rows={2}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingMemoryId(null)}
                      className="px-3 py-1 text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveMemoryEdit(item.id)}
                      className="rounded-lg bg-emerald-600 text-white px-3 py-1 text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingMemoryId(item.id);
                          setEditTitle(item.title);
                          setEditContent(item.content);
                        }}
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground transition"
                        title="Edit Fact"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(item.id)}
                        className="rounded-md p-1 text-muted-foreground hover:text-red-500 transition"
                        title="Delete Fact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>

                  {item.sourceContext && (
                    <span className="text-[10px] text-muted-foreground/70 italic block">
                      {item.sourceContext}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. DECISION PORTFOLIO & 30-DAY RETROSPECTIVES (SECTION 27) ─── */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Your Decision Portfolio ({decisions.length})
            </h3>
          </div>
          <Link
            href="/dashboard/decisions"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Open Decision Lab →
          </Link>
        </div>

        {decisions.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No decisions recorded yet. Use the Decision Lab whenever you face a difficult choice.
          </p>
        ) : (
          <div className="space-y-2">
            {decisions.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background/60 p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-foreground block">{d.title}</span>
                  <span className="text-muted-foreground text-[11px] block mt-0.5">
                    Chosen: <strong className="text-emerald-600 dark:text-emerald-400">{d.finalChoice}</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">
                  {d.status === "reviewed" ? "✓ Reviewed" : "Active"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 4. OFFICIAL AKUCHE BRAND & APP ICON ─── */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Official Akuche Brand &amp; App Icon
            </h3>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Download the new official Akuche logo asset directly to your phone gallery or update your phone&apos;s home screen shortcut.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href="/akuche-logo.png"
            download="akuche-logo.png"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 touch-manipulation min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Download Official Akuche Logo (HD PNG)</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                if (typeof caches !== "undefined") {
                  caches.keys().then((keys) => {
                    Promise.all(keys.map((k) => caches.delete(k))).then(() => {
                      window.location.reload();
                    });
                  }).catch(() => {
                    window.location.reload();
                  });
                } else {
                  window.location.reload();
                }
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card hover:bg-muted px-4 py-3 text-xs font-bold text-foreground transition active:scale-95 touch-manipulation min-h-[44px]"
          >
            <RotateCcw className="h-4 w-4 text-emerald-500" />
            <span>Purge Stale Cache &amp; Refresh</span>
          </button>
        </div>
      </div>

      {/* ─── 5. ACCOUNT & SIGN OUT ─── */}
      <div className="pt-2 flex items-center justify-between border-t border-border/60">
        <span className="text-xs text-muted-foreground">
          Akuche v2.1.0 · Intelligent Decision Companion
        </span>

        <button
          onClick={() => {
            supabase.auth.signOut().then(() => {
              window.location.href = "/login";
            });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
