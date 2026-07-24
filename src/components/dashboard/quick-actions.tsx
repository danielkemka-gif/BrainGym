"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  memory: "🧠",
  focus: "🎯",
  thinking: "💡",
  learning: "📚",
  health: "❤️",
  creativity: "🎨",
  "emotional-intelligence": "🤝",
};

export function QuickActions() {
  const { t } = useI18n();

  const CATEGORY_SLOGANS: Record<string, string> = {
    memory: t.cat_memory_desc,
    focus: t.cat_focus_desc,
    thinking: t.cat_thinking_desc,
    learning: t.cat_learning_desc,
    health: t.cat_health_desc,
    creativity: t.cat_creativity_desc,
    "emotional-intelligence": t.cat_ei_desc,
  };

  const CATEGORY_LABELS: Record<string, string> = {
    memory: t.cat_memory,
    focus: t.cat_focus,
    thinking: t.cat_thinking,
    learning: t.cat_learning,
    health: t.cat_health,
    creativity: t.cat_creativity,
    "emotional-intelligence": t.cat_ei,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t.dashboard_brain_training}</h2>
        <Link
          href="/dashboard/library"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {t.dashboard_view_all} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/dashboard/library?category=${cat.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-transparent hover:shadow-lg hover:shadow-primary/5"
          >
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform group-hover:scale-110 ${CATEGORY_GRADIENTS[cat.id] || "from-gray-500 to-gray-600"}`}
            >
              <span className="text-xl">{CATEGORY_EMOJIS[cat.id]}</span>
            </div>
            <p className="text-sm font-semibold">{CATEGORY_LABELS[cat.id]}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {CATEGORY_SLOGANS[cat.id]}
            </p>
            <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
