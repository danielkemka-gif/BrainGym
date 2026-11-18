"use client";

import React, { useState, useEffect } from "react";
import {
  getMemoryItems,
  saveMemoryItem,
  deleteMemoryItem,
  confirmMemoryItem,
  updateMemoryItem,
  AkucheMemoryItem,
  getCommitments,
  AkucheCommitment,
} from "@/lib/akuche/memory-engine";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Eye,
  Trash2,
  Pencil,
  Plus,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Brain,
} from "lucide-react";
import Link from "next/link";

interface ClarityMapProps {
  filterDomain?: "all" | "business" | "career" | "potential" | "life";
  interactive?: boolean;
}

export function AkucheClarityMap({
  filterDomain = "all",
  interactive = true,
}: ClarityMapProps) {
  const [memories, setMemories] = useState<AkucheMemoryItem[]>([]);
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [activeTab, setActiveTab] = useState<
    "reality" | "blindspots" | "decisions" | "outcomes"
  >("reality");
  const [activeDomain, setActiveDomain] = useState(filterDomain);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<AkucheMemoryItem["category"]>("goal");
  const [editingItem, setEditingItem] = useState<AkucheMemoryItem | null>(null);

  const reloadData = () => {
    setMemories(getMemoryItems());
    setCommitments(getCommitments());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Filter memories based on active domain
  const filteredMemories = memories.filter((m) => {
    if (activeDomain === "all") return true;
    const combined = `${m.title} ${m.content} ${m.tags?.join(" ")}`.toLowerCase();
    return combined.includes(activeDomain);
  });

  // Categorize into the 4 Clarity Map Quadrants
  const realityItems = filteredMemories.filter(
    (m) => m.category === "profile" || m.category === "goal" || m.category === "project"
  );

  const blindspotItems = filteredMemories.filter(
    (m) => m.category === "pattern" || m.title.toLowerCase().includes("missing")
  );

  const decisionItems = filteredMemories.filter(
    (m) => m.category === "decision" || m.category === "commitment"
  );

  const outcomeItems = filteredMemories.filter(
    (m) => m.title.toLowerCase().includes("outcome") || m.title.toLowerCase().includes("lesson")
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    saveMemoryItem({
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      confidence: 1.0,
      verificationStatus: "confirmed",
      sourceContext: `User added to Clarity Map (${activeDomain})`,
      tags: activeDomain !== "all" ? [activeDomain] : [],
    });
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
    reloadData();
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMemoryItem(editingItem.id, {
      title: editingItem.title,
      content: editingItem.content,
      verificationStatus: "confirmed",
    });
    setEditingItem(null);
    reloadData();
  };

  const handleDelete = (id: string) => {
    deleteMemoryItem(id);
    reloadData();
  };

  const handleConfirm = (id: string) => {
    confirmMemoryItem(id);
    reloadData();
  };

  return (
    <div className="rounded-3xl border bg-card/60 backdrop-blur-md p-4 sm:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-foreground">
                The Akuche Clarity Map
              </h2>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Living Map
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your evolving personal intelligence map: Understand circumstances, blind spots &amp; direction
            </p>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "business", "career", "potential", "life"] as const).map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setActiveDomain(dom)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                activeDomain === dom
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {dom === "potential" ? "Youth" : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Quadrant Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("reality")}
          className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
            activeTab === "reality"
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-border/60 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-foreground">1. Reality</span>
            <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
              {realityItems.length}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Situations &amp; Goals
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blindspots")}
          className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
            activeTab === "blindspots"
              ? "border-amber-500 bg-amber-500/10 shadow-sm"
              : "border-border/60 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-foreground">2. Blind Spots</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {blindspotItems.length}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Assumptions &amp; Traps
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("decisions")}
          className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
            activeTab === "decisions"
              ? "border-sky-500 bg-sky-500/10 shadow-sm"
              : "border-border/60 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-foreground">3. Decisions</span>
            <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 text-[10px] font-bold text-sky-600 dark:text-sky-400">
              {decisionItems.length + commitments.length}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Choices &amp; Actions
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("outcomes")}
          className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
            activeTab === "outcomes"
              ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
              : "border-border/60 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-foreground">4. Outcomes</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {outcomeItems.length}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Lessons &amp; Changes
          </span>
        </button>
      </div>

      {/* Action Toolbar */}
      {interactive && (
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-muted-foreground">
            {activeTab === "reality" && "Current Reality & Situations (Goals, Challenges, Ground Truths)"}
            {activeTab === "blindspots" && "Observed Patterns & Unexamined Blind Spots"}
            {activeTab === "decisions" && "Active Decisions, Trade-Offs & Commitments"}
            {activeTab === "outcomes" && "Validated Outcomes, Learned Patterns & Growth"}
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      )}

      {/* Add Item Form */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="rounded-2xl border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Add to Clarity Map</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="rounded-lg border bg-background px-2.5 py-1 text-xs"
            >
              <option value="goal">Goal / Aspiration</option>
              <option value="profile">Current Situation / Reality</option>
              <option value="pattern">Pattern / Blind Spot</option>
              <option value="decision">Decision / Trade-off</option>
              <option value="commitment">Action Commitment</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Title (e.g. Q1 Revenue Bottleneck or Career Crossroads)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Describe the circumstance, observation, or unexamined assumption..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={2}
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
            >
              Save to Map
            </button>
          </div>
        </form>
      )}

      {/* Edit Item Modal / Inline */}
      {editingItem && (
        <form onSubmit={handleUpdateItem} className="rounded-2xl border border-primary/40 bg-muted/40 p-4 space-y-3">
          <span className="text-xs font-bold text-foreground">Edit Clarity Map Item</span>
          <input
            type="text"
            value={editingItem.title}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <textarea
            value={editingItem.content}
            onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
            rows={2}
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
            >
              Update
            </button>
          </div>
        </form>
      )}

      {/* Items List for Current Tab */}
      <div className="space-y-3">
        {/* Tab 1: Reality */}
        {activeTab === "reality" && (
          <>
            {realityItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                No reality milestones or established situations recorded yet for this domain.
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    + Record a situation or goal now
                  </button>
                </div>
              </div>
            ) : (
              realityItems.map((item) => (
                <ClarityItemCard
                  key={item.id}
                  item={item}
                  onConfirm={() => handleConfirm(item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </>
        )}

        {/* Tab 2: Blind Spots */}
        {activeTab === "blindspots" && (
          <>
            {blindspotItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-500/30 p-6 text-center text-xs text-muted-foreground">
                No unexamined blind spots or recurring patterns detected yet.
                <p className="mt-1 text-foreground/80">
                  Run a &ldquo;What Am I Missing?&rdquo; diagnostic to uncover hidden assumptions.
                </p>
                <div className="mt-3">
                  <Link
                    href="/dashboard/clarity"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Run Diagnostic in Clarity Hub</span>
                  </Link>
                </div>
              </div>
            ) : (
              blindspotItems.map((item) => (
                <ClarityItemCard
                  key={item.id}
                  item={item}
                  onConfirm={() => handleConfirm(item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </>
        )}

        {/* Tab 3: Decisions & Commitments */}
        {activeTab === "decisions" && (
          <>
            {decisionItems.length === 0 && commitments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-sky-500/30 p-6 text-center text-xs text-muted-foreground">
                No active decisions or action commitments currently pending.
                <div className="mt-3">
                  <Link
                    href="/dashboard/decisions"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-sky-500/15 px-3 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/25"
                  >
                    <span>Open Decision Lab</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {decisionItems.map((item) => (
                  <ClarityItemCard
                    key={item.id}
                    item={item}
                    onConfirm={() => handleConfirm(item.id)}
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}

                {commitments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                          Action Commitment
                        </span>
                        <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      {c.deadline && (
                        <p className="text-xs text-muted-foreground">Target Date: {c.deadline}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab 4: Outcomes */}
        {activeTab === "outcomes" && (
          <>
            {outcomeItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-500/30 p-6 text-center text-xs text-muted-foreground">
                No verified action outcomes or lessons recorded yet.
                <p className="mt-1">
                  Once you take action on your decisions, review them in Akuche to establish verified lessons.
                </p>
              </div>
            ) : (
              outcomeItems.map((item) => (
                <ClarityItemCard
                  key={item.id}
                  item={item}
                  onConfirm={() => handleConfirm(item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ClarityItemCard({
  item,
  onConfirm,
  onEdit,
  onDelete,
}: {
  item: AkucheMemoryItem;
  onConfirm: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isHypothesis = item.verificationStatus === "ai_interpreted";

  return (
    <div className="rounded-2xl border bg-card p-3.5 sm:p-4 space-y-2 shadow-xs transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>

            {isHypothesis ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-3 w-3" />
                <span>AI Hypothesis</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                <span>Confirmed Fact</span>
              </span>
            )}

            {item.confidence && item.confidence >= 0.85 && (
              <span className="text-[10px] font-semibold text-muted-foreground">
                High Confidence
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/85 leading-relaxed">{item.content}</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-muted-foreground">
          {isHypothesis && (
            <button
              type="button"
              onClick={onConfirm}
              title="Confirm this insight as accurate"
              className="rounded-lg p-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            title="Edit item"
            className="rounded-lg p-1.5 hover:bg-muted hover:text-foreground transition"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete item"
            className="rounded-lg p-1.5 hover:bg-destructive/10 hover:text-destructive transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {item.sourceContext && (
        <div className="text-[10px] text-muted-foreground/75 italic">
          Source: {item.sourceContext}
        </div>
      )}
    </div>
  );
}
