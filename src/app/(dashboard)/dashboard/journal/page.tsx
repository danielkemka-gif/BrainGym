"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, BookOpen, Calendar, Tag, X, Share2, Sparkles, ArrowRight } from "lucide-react";
import { JournalShareCardModal } from "@/components/journal/journal-share-card-modal";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const MOODS = [
  { value: "great", label: "Great", emoji: "🔥", color: "text-green-400 bg-green-500/10" },
  { value: "good", label: "Good", emoji: "😊", color: "text-blue-400 bg-blue-500/10" },
  { value: "okay", label: "Okay", emoji: "😐", color: "text-yellow-400 bg-yellow-500/10" },
  { value: "tired", label: "Tired", emoji: "😴", color: "text-orange-400 bg-orange-500/10" },
  { value: "stressed", label: "Stressed", emoji: "😰", color: "text-red-400 bg-red-500/10" },
];

const TAG_SUGGESTIONS = [
  "DecisionMaking", "Focus", "Memory", "Breakthrough", "MentalFitness",
  "Reflection", "Leadership", "Habits", "Gratitude", "Patience",
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Share Card Modal State
  const [shareModalEntry, setShareModalEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("brain_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setEntries(data as JournalEntry[]);
    setLoading(false);
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setMood("");
    setTags([]);
    setTagInput("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(entry: JournalEntry) {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "");
    setTags(entry.tags || []);
    setEditingId(entry.id);
    setShowForm(true);
  }

  function addTag(tag: string) {
    const t = tag.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function saveEntry() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const payload = {
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      mood: mood || null,
      tags,
    };

    if (editingId) {
      await supabase
        .from("brain_journal")
        .update({ title: payload.title, content: payload.content, mood: payload.mood, tags: payload.tags })
        .eq("id", editingId);
    } else {
      await supabase.from("brain_journal").insert(payload);
    }

    resetForm();
    await fetchEntries();
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this journal entry?")) return;
    const supabase = createClient();
    await supabase.from("brain_journal").delete().eq("id", id);
    await fetchEntries();
  }

  const filtered = entries.filter((e) =>
    search
      ? e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      : true
  );

  const moodObj = (m: string) => MOODS.find((mo) => mo.value === m);

  return (
    <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 pb-24 touch-manipulation">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-balance text-xl font-bold sm:text-2xl flex items-center gap-2">
            <span>My BrainGym Journal</span>
            <span className="text-lg">📖</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Reflect on real-life decisions, track cognitive breakthroughs, and turn insights into shareable wisdom.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/dashboard/workout"
            className="inline-flex h-11 sm:h-12 flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-[0.97]"
          >
            <span>Today&apos;s Workout</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex h-11 sm:h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-primary-foreground hover:bg-primary/90 active:scale-[0.97] shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            New Reflection
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-foreground">{editingId ? "Edit Journal Entry" : "Write Reflection & Decision Log"}</h2>
            <button onClick={resetForm} className="rounded-full p-1.5 text-muted-foreground hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Give this reflection a title (e.g. Navigating a tough client meeting)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          <textarea
            placeholder="What happened? What decision did you make? What did you learn? How will you apply this tomorrow?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-border bg-background p-4 text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          {/* Mood Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">How did you feel about this decision?</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    mood === m.value
                      ? "border-primary bg-primary/10 text-primary font-black shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">Add Focus Tags (up to 5)</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                  <span>#{t}</span>
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAG_SUGGESTIONS.filter((s) => !tags.includes(s)).slice(0, 6).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/80"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              onClick={resetForm}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={saveEntry}
              disabled={saving || !title.trim() || !content.trim()}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white shadow-md hover:brightness-110 disabled:opacity-50 transition active:scale-95"
            >
              {saving ? "Saving..." : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {!showForm && entries.length > 0 && (
        <input
          type="text"
          placeholder="Search your reflections by keyword, decision, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-xs sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      )}

      {/* Entries List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Smart Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 sm:p-12 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base sm:text-lg font-black text-foreground">
              {entries.length === 0 ? "Your BrainGym Journal is waiting" : "No matching reflections found"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {entries.length === 0
                ? "Complete today's real-life mental fitness challenge or write your first entry to track your decision-making growth."
                : "Try a different search term or clear the filter."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href="/dashboard/workout"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-white py-3 px-5 text-xs font-black shadow-md shadow-primary/25 hover:brightness-110 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>START TODAY&apos;S WORKOUT &amp; REFLECT ➔</span>
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-background py-3 px-4 text-xs font-bold text-foreground hover:bg-muted"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span>Write Blank Entry</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => {
            const m = moodObj(entry.mood || "");
            return (
              <div
                key={entry.id}
                className="rounded-3xl border-2 border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {m && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${m.color}`}>
                          {m.emoji} {m.label}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-foreground">{entry.title}</h3>
                  </div>

                  {/* Actions: Share Card + Edit + Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setShareModalEntry(entry)}
                      className="inline-flex items-center gap-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-3 text-xs font-black transition active:scale-95 border border-primary/20"
                      title="Share Reflection as Social Card"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share Card</span>
                    </button>

                    <button
                      onClick={() => startEdit(entry)}
                      className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="rounded-xl p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/60">
                    {entry.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── SHARE CARD MODAL ────────────────────────────────────────────────── */}
      {shareModalEntry && (
        <JournalShareCardModal
          isOpen={Boolean(shareModalEntry)}
          onClose={() => setShareModalEntry(null)}
          challengeTitle={shareModalEntry.title}
          takeaway={shareModalEntry.content.split("\n")[0] || "Pause. Understand. Then decide."}
          reflectionText={shareModalEntry.content}
        />
      )}
    </div>
  );
}
