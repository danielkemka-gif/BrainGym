"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function drawCard(ctx: CanvasRenderingContext2D, W: number, H: number, stats: UserStats) {
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#1a1a2e");
  bgGrad.addColorStop(0.5, "#16213e");
  bgGrad.addColorStop(1, "#0f3460");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

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

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundRect(ctx, W / 2 - 280, 60, 560, 80, 40);
  ctx.fill();

  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("BrainGym", W / 2, 108);

  ctx.font = "bold 52px system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(stats.name, W / 2, 200);

  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#a78bfa";
  ctx.fillText(`${stats.levelTitle} — Level ${stats.level}`, W / 2, 245);

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

  const catEmoji: Record<string, string> = {
    memory: "🧠", focus: "🎯", thinking: "💡",
    learning: "📚", health: "❤️", creativity: "🎨",
    "emotional-intelligence": "🤝",
  };

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
}

export default function ShareCardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

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
        const s: UserStats = {
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
        };
        setStats(s);
        setLoading(false);
      });
    });
  }, []);

  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !stats) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 540;
    const H = 540;
    canvas.width = W;
    canvas.height = H;
    ctx.save();
    ctx.scale(W / 1080, H / 1080);
    drawCard(ctx, 1080, 1080, stats);
    ctx.restore();
  }, [stats]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  function generateCard(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = exportCanvasRef.current;
      if (!canvas || !stats) { resolve(null); return; }

      setGenerating(true);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }

      canvas.width = 1080;
      canvas.height = 1080;
      drawCard(ctx, 1080, 1080, stats);

      canvas.toBlob((blob) => {
        setGenerating(false);
        resolve(blob);
      }, "image/png", 1.0);
    });
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

  const [copied, setCopied] = useState(false);

  const shareText = stats
    ? `🧠 I'm a Level ${stats.level} ${stats.levelTitle} on BrainGym! ${stats.totalXp} XP earned, ${stats.streak}-day streak 🔥\n\nTrain your brain at braingym.app`
    : "";

  function getShareUrl(platform: string) {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent("https://braingym.app");
    switch (platform) {
      case "whatsapp": return `https://api.whatsapp.com/send?text=${text}`;
      case "twitter": return `https://twitter.com/intent/tweet?text=${text}`;
      case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case "telegram": return `https://t.me/share/url?url=${url}&text=${text}`;
      default: return "#";
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  interface ShareButton {
    id: string;
    label: string;
    logo: string;
    type: "link" | "download" | "copy";
  }

  const shareButtons: ShareButton[] = [
    { id: "whatsapp", label: "WhatsApp", logo: "/whatsapp-logo.webp", type: "link" },
    { id: "twitter", label: "X / Twitter", logo: "/x-logo.jpg", type: "link" },
    { id: "facebook", label: "Facebook", logo: "/facebook-logo.webp", type: "link" },
    { id: "instagram", label: "Instagram", logo: "/instagram-logo.webp", type: "download" },
    { id: "tiktok", label: "TikTok", logo: "/tiktok-logo.png", type: "download" },
    { id: "snapchat", label: "Snapchat", logo: "/snapchat-logo.webp", type: "download" },
    { id: "telegram", label: "Telegram", logo: "/telegram-logo.webp", type: "link" },
    { id: "linkedin", label: "LinkedIn", logo: "/linkedin-logo.webp", type: "link" },
    { id: "copy", label: copied ? "Copied!" : "Copy Text", logo: "", type: "copy" },
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
              ref={previewCanvasRef}
              className="w-full"
              style={{ imageRendering: "auto" }}
            />
          </div>

          {/* Hidden canvas for generation */}
          <canvas ref={exportCanvasRef} className="hidden" />

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
            <div className="grid grid-cols-3 gap-3">
              {shareButtons.map((btn) => {
                if (btn.type === "copy") {
                  return (
                    <button
                      key={btn.id}
                      onClick={handleCopy}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 transition-all hover:border-muted-foreground/30 hover:shadow-sm active:scale-[0.97]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                        {copied ? "✅" : "📋"}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{btn.label}</span>
                    </button>
                  );
                }

                if (btn.type === "download") {
                  return (
                    <button
                      key={btn.id}
                      onClick={handleDownload}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 transition-all hover:border-muted-foreground/30 hover:shadow-sm active:scale-[0.97]"
                    >
                      <img
                        src={btn.logo}
                        alt={btn.label}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-[10px] text-muted-foreground">{btn.label}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={btn.id}
                    href={getShareUrl(btn.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 transition-all hover:border-muted-foreground/30 hover:shadow-sm"
                  >
                    <img
                      src={btn.logo}
                      alt={btn.label}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-[10px] text-muted-foreground">{btn.label}</span>
                  </a>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Instagram, TikTok &amp; Snapchat: tap the logo to download your card, then share it in-app
            </p>
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
