"use client";

import React, { useState, useEffect } from "react";
import {
  getMemoryItems,
  saveMemoryItem,
  updateMemoryItem,
  deleteMemoryItem,
  isMemoryEnabled,
  setMemoryEnabled,
  AkucheMemoryItem,
} from "@/lib/akuche/memory-engine";
import {
  Brain,
  X,
  Trash2,
  Plus,
  Shield,
  Eye,
  Check,
  AlertCircle,
  Pencil,
  Sparkles,
} from "lucide-react";

interface MyMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyMemoryModal({ isOpen, onClose }: MyMemoryModalProps) {
  const [items, setItems] = useState<AkucheMemoryItem[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<AkucheMemoryItem["category"]>("goal");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const refresh = () => {
    setItems(getMemoryItems());
    setEnabled(isMemoryEnabled());
  };

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMemory = () => {
    const next = !enabled;
    setMemoryEnabled(next);
    setEnabled(next);
  };

  const handleAddNew = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    saveMemoryItem({
      category: newCategory,
      title: newTitle,
      content: newContent,
      sourceContext: "Manually added by you in My Memory",
    });
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
    refresh();
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateMemoryItem(id, {
      title: editTitle,
      content: editContent,
    });
    setEditingId(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteMemoryItem(id);
    refresh();
  };

  const filteredItems =
    activeTab === "all" ? items : items.filter((i) => i.category === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                <span>My Memory</span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  Privacy &amp; Control
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                What Akuche remembers to personalize your thinking sessions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Memory Toggle Banner */}
        <div className="border-b border-border/60 px-5 py-3 bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-foreground">
              Long-Term Context Memory
            </span>
          </div>
          <button
            onClick={handleToggleMemory}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              enabled
                ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border/60 overflow-x-auto text-xs scrollbar-none">
          {["all", "profile", "goal", "project", "decision", "commitment", "pattern"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition shrink-0 ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Items Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {isAdding && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Add New Memory Fact</span>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as AkucheMemoryItem["category"])
                }
                className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="profile">Profile (Occupation, skills, interests)</option>
                <option value="goal">Goal (Financial, business, career target)</option>
                <option value="project">Project (Active business or personal venture)</option>
                <option value="decision">Decision (Key choice or boundary filter)</option>
                <option value="commitment">Commitment (Promise or deadline)</option>
                <option value="pattern">Pattern (Observed strength or tendency)</option>
              </select>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (e.g. ₦5M Target by Q4)"
                className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              />

              <textarea
                rows={2}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Details of what to remember..."
                className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  disabled={!newTitle.trim() || !newContent.trim()}
                  onClick={handleAddNew}
                  className="rounded-xl bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold disabled:opacity-40"
                >
                  Save Fact
                </button>
              </div>
            </div>
          )}

          {filteredItems.length === 0 && !isAdding && (
            <div className="py-8 text-center space-y-1.5 text-muted-foreground">
              <Eye className="mx-auto h-6 w-6 opacity-40" />
              <p className="text-xs font-semibold">No memories in this category.</p>
            </div>
          )}

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/80 bg-background/60 p-3.5 space-y-1.5 hover:border-emerald-500/30 transition"
            >
              {editingId === item.id ? (
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
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="rounded-lg bg-emerald-600 text-white px-3 py-1 text-xs font-bold"
                    >
                      Save
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
                          setEditingId(item.id);
                          setEditTitle(item.title);
                          setEditContent(item.content);
                        }}
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground transition"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md p-1 text-muted-foreground hover:text-red-500 transition"
                      >
                        <Trash2 className="h-3 w-3" />
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

        {/* Footer */}
        <div className="border-t border-border/80 px-5 py-3 bg-muted/20 flex items-center justify-between">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Memory</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-foreground text-background px-4 py-1.5 text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
