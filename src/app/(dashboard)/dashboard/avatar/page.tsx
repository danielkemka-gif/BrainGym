"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AVATAR_PARTS, AVATAR_EVOLUTION_STAGES, AVATAR_COLORS } from "@/lib/constants";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { useI18n } from "@/lib/i18n";
import { getLevel } from "@/lib/scoring";
import { Palette, Save, RotateCcw, Sparkles } from "lucide-react";

interface AvatarState {
  body_type: string;
  skin_tone: string;
  hair_style: string;
  hair_color: string;
  outfit_id: string;
  background_id: string;
  frame_id: string;
  accessory_id: string;
  expression: string;
  evolution_stage: string;
}

type PartCategory = keyof typeof AVATAR_PARTS;

const CATEGORY_LABELS: Record<PartCategory, string> = {
  body: "Body Type",
  skin: "Skin Tone",
  hair: "Hair Style",
  outfit: "Outfit",
  background: "Background",
  frame: "Frame",
  accessory: "Accessory",
  expression: "Expression",
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  uncommon: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rare: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  epic: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  legendary: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const DEFAULT_AVATAR: AvatarState = {
  body_type: "round",
  skin_tone: "warm",
  hair_style: "short",
  hair_color: "#4a3728",
  outfit_id: "basic",
  background_id: "default",
  frame_id: "none",
  accessory_id: "none",
  expression: "happy",
  evolution_stage: "egg",
};

export default function AvatarPage() {
  const { t } = useI18n();
  const [avatar, setAvatar] = useState<AvatarState>(DEFAULT_AVATAR);
  const [savedAvatar, setSavedAvatar] = useState<AvatarState>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PartCategory>("body");
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      Promise.all([
        supabase.from("user_avatars").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("xp_ledger").select("amount").eq("user_id", user.id),
      ]).then(([avatarRes, xpRes]) => {
        if (avatarRes.data) {
          const a = {
            body_type: avatarRes.data.body_type,
            skin_tone: avatarRes.data.skin_tone,
            hair_style: avatarRes.data.hair_style,
            hair_color: avatarRes.data.hair_color,
            outfit_id: avatarRes.data.outfit_id,
            background_id: avatarRes.data.background_id,
            frame_id: avatarRes.data.frame_id,
            accessory_id: avatarRes.data.accessory_id,
            expression: avatarRes.data.expression,
            evolution_stage: avatarRes.data.evolution_stage,
          };
          setAvatar(a);
          setSavedAvatar(a);
        }

        const totalXp = (xpRes.data ?? []).reduce((sum, l) => sum + l.amount, 0);
        setUserLevel(getLevel(totalXp).level);
        setLoading(false);
      });
    });
  }, []);

  const hasChanges = JSON.stringify(avatar) !== JSON.stringify(savedAvatar);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("user_avatars")
      .upsert({
        user_id: user.id,
        ...avatar,
        evolution_stage: getEvolutionStage(userLevel),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (!error) {
      setSavedAvatar(avatar);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setAvatar(DEFAULT_AVATAR);
  };

  function getEvolutionStage(level: number): string {
    if (level >= 10) return "brain_lord";
    if (level >= 7) return "guardian";
    if (level >= 5) return "sapling";
    if (level >= 3) return "hatchling";
    return "egg";
  }

  const currentStage = AVATAR_EVOLUTION_STAGES.find((s) => s.id === getEvolutionStage(userLevel));

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      {/* Header */}
      <div>
        <h1 className="text-balance text-xl font-bold sm:text-2xl flex items-center gap-2">
          <Palette className="h-6 w-6 text-pink-500 shrink-0" />
          Brain Avatar
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your brain avatar — evolves as you level up
        </p>
      </div>

      {/* Avatar Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-col items-center gap-4">
          <CustomAvatar
            bodyType={avatar.body_type}
            skinTone={avatar.skin_tone}
            hairStyle={avatar.hair_style}
            hairColor={avatar.hair_color}
            outfitId={avatar.outfit_id}
            backgroundId={avatar.background_id}
            frameId={avatar.frame_id}
            accessoryId={avatar.accessory_id}
            expression={avatar.expression}
            evolutionStage={getEvolutionStage(userLevel) as any}
            size="hero"
            showFrame={true}
            showStage={true}
          />

          <div className="text-center">
            <p className="text-lg font-bold">{currentStage?.emoji} {currentStage?.label}</p>
            <p className="text-sm text-muted-foreground">{currentStage?.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">Level {userLevel}</p>
          </div>

          {/* Evolution Progress */}
          <div className="w-full max-w-sm">
            <div className="flex justify-between mb-1">
              {AVATAR_EVOLUTION_STAGES.map((stage) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <span className={`text-lg ${userLevel >= stage.minLevel ? "" : "grayscale opacity-40"}`}>
                    {stage.emoji}
                  </span>
                  <span className={`text-[9px] ${userLevel >= stage.minLevel ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    Lv.{stage.minLevel}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (userLevel / 15) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {(Object.keys(AVATAR_PARTS) as PartCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AVATAR_PARTS[activeCategory].map((part) => {
            const stateKey: keyof AvatarState = activeCategory === "skin" ? "skin_tone" : activeCategory === "outfit" ? "outfit_id" : activeCategory === "background" ? "background_id" : activeCategory === "frame" ? "frame_id" : activeCategory === "accessory" ? "accessory_id" : activeCategory === "hair" ? "hair_style" : activeCategory as keyof AvatarState;
            const isActive = avatar[stateKey] === part.id;

            return (
              <button
                key={part.id}
                onClick={() => {
                  const key: keyof AvatarState = activeCategory === "skin" ? "skin_tone"
                    : activeCategory === "outfit" ? "outfit_id"
                    : activeCategory === "background" ? "background_id"
                    : activeCategory === "frame" ? "frame_id"
                    : activeCategory === "accessory" ? "accessory_id"
                    : activeCategory === "hair" ? "hair_style"
                    : activeCategory as keyof AvatarState;
                  setAvatar((prev) => ({ ...prev, [key]: part.id }));
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all ${
                  isActive
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="text-2xl">
                  {activeCategory === "expression" ? (
                    <span>{part.id === "happy" ? "😊" : part.id === "focus" ? "🤔" : part.id === "fire" ? "🔥" : part.id === "star" ? "⭐" : "🌌"}</span>
                  ) : activeCategory === "skin" ? (
                    <div className="h-8 w-8 rounded-full" style={{ backgroundColor: (AVATAR_COLORS.skin as Record<string, string>)[part.id] ?? "#ccc" }} />
                  ) : activeCategory === "hair" ? (
                    <div className="h-6 w-8 rounded-full" style={{ backgroundColor: (AVATAR_COLORS.hair as Record<string, string>)[part.id] ?? "#4a3728" }} />
                  ) : activeCategory === "outfit" ? (
                    <div className="h-6 w-8 rounded-lg" style={{ backgroundColor: (AVATAR_COLORS.outfit as Record<string, string>)[part.id] ?? "#3b82f6" }} />
                  ) : activeCategory === "background" ? (
                    <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: (AVATAR_COLORS.bg as Record<string, string>)[part.id] ?? "#f8fafc" }} />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm">
                      {part.id === "none" ? "—" : part.id === "glasses" ? "🤓" : part.id === "headphones" ? "🎧" : part.id === "crown" ? "👑" : "—"}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight">{part.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${RARITY_COLORS[part.rarity]}`}>
                  {part.rarity}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {saved ? (
            <>
              <Sparkles className="h-4 w-4" />
              Saved!
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Avatar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
