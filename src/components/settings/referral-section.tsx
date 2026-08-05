"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Gift, Copy, Check, Users, Share2 } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://brain-gym-nsu6.vercel.app";

export function ReferralSection() {
  const { user, supabase } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referral_count")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
        setReferralCount(profile.referral_count ?? 0);
      } else {
        const code = `BG${user.id.slice(0, 8).toUpperCase()}`;
        await supabase
          .from("profiles")
          .update({ referral_code: code })
          .eq("user_id", user.id);
        setReferralCode(code);
        setReferralCount(0);
      }
      setLoading(false);
    })();
  }, [user, supabase]);

  const inviteUrl = `${APP_URL}/signup?ref=${referralCode}`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function share() {
    const text = `Join me on BrainGym — train your brain with fun daily exercises! ${inviteUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "BrainGym", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <Gift className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <h2 className="font-semibold">Refer a Friend</h2>
          <p className="text-xs text-muted-foreground">Both of you earn 100 bonus coins</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your Code</p>
          <p className="mt-1 text-lg font-black tracking-widest text-primary">{referralCode}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyCode}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-accent min-h-[44px] active:scale-[0.97]"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          onClick={share}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px] active:scale-[0.97]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 rounded-xl bg-muted/50 py-3">
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold">{referralCount}</span>
          <span className="text-muted-foreground">referrals</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm">
          <span className="font-bold text-amber-500">{referralCount * 100}</span>
          <span className="text-muted-foreground"> coins earned</span>
        </div>
      </div>
    </div>
  );
}
