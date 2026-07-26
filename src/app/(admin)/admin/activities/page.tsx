"use client";

import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/constants";
import { Edit, Trash2, Plus, Eye, EyeOff, X } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  difficulty: string;
  estimated_time: number;
  xp: number;
  coins: number;
  is_active: boolean;
}

function ActivityForm({
  activity,
  onSave,
  onCancel,
}: {
  activity?: Activity | null;
  onSave: (data: Partial<Activity>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: activity?.title || "",
    description: activity?.description || "",
    category_id: activity?.category_id || CATEGORIES[0].id,
    difficulty: activity?.difficulty || "beginner",
    estimated_time: activity?.estimated_time || 5,
    xp: activity?.xp || 10,
    coins: activity?.coins || 5,
    is_active: activity?.is_active ?? true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{activity ? "Edit Activity" : "New Activity"}</h2>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Time (min)</label>
              <input
                type="number"
                value={form.estimated_time}
                onChange={(e) => setForm({ ...form, estimated_time: parseInt(e.target.value) || 0 })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">XP</label>
              <input
                type="number"
                value={form.xp}
                onChange={(e) => setForm({ ...form, xp: parseInt(e.target.value) || 0 })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Coins</label>
              <input
                type="number"
                value={form.coins}
                onChange={(e) => setForm({ ...form, coins: parseInt(e.target.value) || 0 })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="is_active" className="text-sm">Active (visible to users)</label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.title}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {activity ? "Save Changes" : "Create Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    const res = await fetch(`/api/admin/activities?${params}`);
    const data = await res.json();
    setActivities(data.activities ?? []);
    setLoading(false);
  }, [category, difficulty]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  async function handleSave(data: Partial<Activity>) {
    if (editingActivity) {
      await fetch(`/api/admin/activities/${editingActivity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return;
    await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    fetchActivities();
  }

  const getCategoryName = (id: string) =>
    CATEGORIES.find((c) => c.id === id)?.label || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activities</h1>
          <p className="text-sm text-muted-foreground">
            Manage {activities.length} brain training activities
          </p>
        </div>
        <button
          onClick={() => { setEditingActivity(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-muted/50" role="status" aria-live="polite" aria-label="Loading activities" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Difficulty</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">XP</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {getCategoryName(a.category_id)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                      {a.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">{a.xp}</td>
                  <td className="px-4 py-3">
                    {a.is_active ? (
                      <Eye className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingActivity(a); setShowForm(true); }}
                        className="rounded-lg p-1.5 hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No activities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingActivity(null); }}
        />
      )}
    </div>
  );
}
