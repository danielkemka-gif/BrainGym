"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, BookOpen, Calendar, Tag, X } from "lucide-react";

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
  "Memory", "Focus", "Breakthrough", "Challenge", "Milestone",
  "Learning", "Reflection", "Goal", "Gratitude", "Motivation",
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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brain Journal</h1>
          <p className="text-sm text-muted-foreground">
            Write about your brain training journey
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? "Edit Entry" : "New Journal Entry"}</h2>
            <button onClick={resetForm} className="rounded-full p-1 text-muted-foreground hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Give this entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          <textarea
            placeholder="How was your brain training today? What did you learn? What challenged you? What are you proud of?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          {/* Mood */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">How are you feeling?</p>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(mood === m.value ? "" : m.value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    mood === m.value
                      ? m.color + " border-current"
                      : "border-border text-muted-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Tags (optional)</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).slice(0, 6).map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className="rounded-full border border-dashed border-border px-2.5 py-1 text-[10px] text-muted-foreground hover:border-primary/50 hover:text-primary"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveEntry}
              disabled={!title.trim() || !content.trim() || saving}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Entry" : "Save Entry"}
            </button>
            <button
              onClick={resetForm}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {!showForm && entries.length > 0 && (
        <input
          type="text"
          placeholder="Search your journal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-card px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      )}

      {/* Entries */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium">
            {entries.length === 0 ? "Start your journal" : "No entries found"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length === 0
              ? "Write about your brain training experiences, breakthroughs, and reflections."
              : "Try a different search term."}
          </p>
          {entries.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              Write your first entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => {
            const m = moodObj(entry.mood || "");
            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {m && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.color}`}>
                          {m.emoji} {m.label}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold">{entry.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                      {entry.content}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {entry.tags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                            <Tag className="h-2.5 w-2.5" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => startEdit(entry)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
