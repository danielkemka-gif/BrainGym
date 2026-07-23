"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLevelProgress } from "@/lib/scoring";
import { LEVELS, CATEGORIES } from "@/lib/constants";
import { Download, Share2, Trophy, Zap, Flame, Star, Target } from "lucide-react";

interface UserStats {
  name: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  totalCoins: number;
  streak: number;
  longestStreak: number;
  activitiesCompleted: number;
  workoutsCompleted: number;
  topCategory: string;
}

export default function ShareCardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const name =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "BrainGym User";

      Promise.all([
        supabase.from("xp_ledger").select("amount").eq("user_id", user.id)
          .then(({ data }) => data ? data.reduce((s, r) => s + r.amount, 0) : 0),
        supabase.from("coins_ledger").select("amount").eq("user_id", user.id)
          .then(({ data }) => data ? data.reduce((s, r) => s + r.amount, 0) : 0),
        supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", user.id).maybeSingle()
          .then(({ data }) => ({ current: data?.current_streak ?? 0, longest: data?.longest_streak ?? 0 })),
        supabase.from("activity_logs").select("id").eq("user_id", user.id)
          .then(({ data }) => data?.length ?? 0),
        supabase.from("daily_workouts").select("id").eq("user_id", user.id).eq("status", "completed")
          .then(({ data }) => data?.length ?? 0),
        supabase.from("activity_logs").select("activities(category_id)").eq("user_id", user.id)
          .then(({ data }) => {
            if (!data) return "Memory";
            const counts: Record<string, number> = {};
            data.forEach((log: any) => {
              const cat = log.activities?.category_id;
              if (cat) counts[cat] = (counts[cat] || 0) + 1;
            });
            return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Memory";
          }),
      ]).then(([xp, coin, streak, activitiesDone, workoutsDone, topCat]) => {
        const { level } = getLevelProgress(xp);
        setStats({
          name: name.split(" ")[0],
          level: level.level,
          levelTitle: level.title,
          totalXp: xp,
          totalCoins: coin,
          streak: streak.current,
          longestStreak: streak.longest,
          activitiesCompleted: activitiesDone,
          workoutsCompleted: workoutsDone,
          topCategory: topCat,
        });
        setLoading(false);
      });
    });
  }, []);

  function generateCard(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas || !stats) { resolve(null); return; }

      setGenerating(true);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }

      const W = 1080;
      const H = 1080;
      canvas.width = W;
      canvas.height = H;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#1a1a2e");
      bgGrad.addColorStop(0.5, "#16213e");
      bgGrad.addColorStop(1, "#0f3460");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Decorative circles
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(W * 0.8, H * 0.2, 200, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(W * 0.2, H * 0.8, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Top badge
      const catColors: Record<string, string> = {
        memory: "#6366f1", focus: "#f59e0b", thinking: "#10b981",
        learning: "#3b82f6", health: "#ef4444", creativity: "#ec4899",
        "emotional-intelligence": "#8b5cf6",
      };
      const catEmoji: Record<string, string> = {
        memory: "🧠", focus: "🎯", thinking: "💡",
        learning: "📚", health: "❤️", creativity: "🎨",
        "emotional-intelligence": "🤝",
      };

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      roundRect(ctx, W / 2 - 280, 60, 560, 80, 40);
      ctx.fill();

      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("🧠 BrainGym", W / 2, 108);

      // Name and level
      ctx.font = "bold 52px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(stats.name, W / 2, 200);

      ctx.font = "24px system-ui, sans-serif";
      ctx.fillStyle = "#a78bfa";
      ctx.fillText(`${stats.levelTitle} — Level ${stats.level}`, W / 2, 245);

      // Stats grid
      const gridY = 310;
      const gridH = 400;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(ctx, 80, gridY, W - 160, gridH, 24);
      ctx.fill();

      const statItems = [
        { icon: "⚡", value: stats.totalXp.toLocaleString(), label: "Total XP", color: "#a78bfa" },
        { icon: "🪙", value: stats.totalCoins.toLocaleString(), label: "Coins Earned", color: "#fbbf24" },
        { icon: "🔥", value: `${stats.streak}`, label: "Day Streak", color: "#f97316" },
        { icon: "🏆", value: `${stats.longestStreak}`, label: "Best Streak", color: "#ef4444" },
        { icon: "✅", value: `${stats.activitiesCompleted}`, label: "Activities Done", color: "#22c55e" },
        { icon: "🏋️", value: `${stats.workoutsCompleted}`, label: "Workouts Done", color: "#3b82f6" },
      ];

      const cols = 3;
      const cellW = (W - 160) / cols;
      const cellH = gridH / 2;

      statItems.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 80 + col * cellW + cellW / 2;
        const y = gridY + row * cellH + cellH / 2;

        ctx.font = "36px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(item.icon, x, y - 20);

        ctx.font = "bold 32px system-ui, sans-serif";
        ctx.fillStyle = item.color;
        ctx.fillText(item.value, x, y + 20);

        ctx.font = "16px system-ui, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(item.label, x, y + 50);
      });

      // Bottom bar
      const botY = H - 180;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(ctx, 80, botY, W - 160, 100, 20);
      ctx.fill();

      const topCatLabel = CATEGORIES.find((c) => c.id === stats.topCategory)?.label || "Memory";
      const topCatEmoji = catEmoji[stats.topCategory] || "🧠";

      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(`Top skill: ${topCatEmoji} ${topCatLabel}`, W / 2, botY + 40);

      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Train your brain at braingym.app", W / 2, botY + 75);

      canvas.toBlob((blob) => {
        setGenerating(false);
        resolve(blob);
      }, "image/png", 1.0);
    });
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  async function handleDownload() {
    const blob = await generateCard();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "braingym-stats.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  function getShareUrl(platform: string) {
    const text = encodeURIComponent(
      `🧠 I'm a Level ${stats?.level} ${stats?.levelTitle} on BrainGym! ${stats?.totalXp} XP earned, ${stats?.streak}-day streak 🔥\n\nTrain your brain at braingym.app`
    );
    const url = encodeURIComponent("https://braingym.app");
    switch (platform) {
      case "whatsapp": return `https://api.whatsapp.com/send?text=${text}`;
      case "twitter": return `https://twitter.com/intent/tweet?text=${text}`;
      case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case "telegram": return `https://t.me/share/url?url=${url}&text=${text}`;
      case "reddit": return `https://reddit.com/submit?url=${url}&title=${text}`;
      case "email": return `mailto:?subject=Check out BrainGym&body=${text}`;
      default: return "#";
    }
  }

  const shareButtons = [
    { id: "whatsapp", label: "WhatsApp", color: "bg-green-500", icon: "💬" },
    { id: "twitter", label: "X / Twitter", color: "bg-black", icon: "𝕏" },
    { id: "facebook", label: "Facebook", color: "bg-blue-600", icon: "📘" },
    { id: "instagram", label: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: "📷" },
    { id: "telegram", label: "Telegram", color: "bg-sky-500", icon: "✈️" },
    { id: "tiktok", label: "TikTok", color: "bg-black", icon: "🎵" },
    { id: "snapchat", label: "Snapchat", color: "bg-yellow-400", icon: "👻" },
    { id: "linkedin", label: "LinkedIn", color: "bg-blue-700", icon: "💼" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Share Your Progress</h1>
        <p className="text-sm text-muted-foreground">
          Generate a beautiful card and share your brain training stats with friends
        </p>
      </div>

      {loading ? (
        <div className="aspect-square max-w-md animate-pulse rounded-2xl bg-muted mx-auto" />
      ) : stats ? (
        <>
          {/* Preview */}
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ imageRendering: "auto" }}
            />
          </div>

          {/* Hidden canvas for generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Download */}
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={handleDownload}
              disabled={generating}
              className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {generating ? "Generating..." : "Download Image"}
            </button>
          </div>

          {/* Social share buttons */}
          <div className="space-y-3">
            <h2 className="font-semibold text-center">Share on Social Media</h2>
            <div className="grid grid-cols-4 gap-3">
              {shareButtons.map((btn) => (
                <a
                  key={btn.id}
                  href={getShareUrl(btn.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 transition-all hover:border-muted-foreground/30 hover:shadow-sm"
                >
                  <span className="text-2xl">{btn.icon}</span>
                  <span className="text-[10px] text-muted-foreground">{btn.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Could not load your stats.</p>
        </div>
      )}
    </div>
  );
}
