"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Linkedin,
  Facebook,
  Sparkles,
  Quote,
  Pencil,
  Smartphone,
} from "lucide-react";

interface JournalShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
  takeaway: string;
  reflectionText: string;
  userName?: string;
}

export function JournalShareCardModal({
  isOpen,
  onClose,
  challengeTitle,
  takeaway,
  reflectionText,
  userName = "BrainGym Member",
}: JournalShareCardModalProps) {
  const [editedTakeaway, setEditedTakeaway] = useState(takeaway || "Pause. Understand. Then decide.");
  const [editedNote, setEditedNote] = useState(reflectionText || "Reacting quickly isn't the same as responding wisely.");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize when parent passes updated typed reflection or opens modal
  useEffect(() => {
    if (takeaway) setEditedTakeaway(takeaway);
    if (reflectionText) setEditedNote(reflectionText);
  }, [takeaway, reflectionText, isOpen]);

  if (!isOpen) return null;

  const formattedShareText = `🧠 TODAY'S BRAINGYM REFLECTION\n\n📌 Today's Challenge:\n${challengeTitle}\n\n💡 My Key Takeaway:\n"${editedTakeaway}"\n\n📝 My Reflection:\n${editedNote}\n\n✨ Train your mind. Improve your life.\n👉 Join me on BrainGym: https://braingym-live.vercel.app`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Today's BrainGym Reflection",
          text: formattedShareText,
          url: "https://braingym-live.vercel.app",
        });
      } catch {
        // user cancelled or unsupported
      }
    } else {
      handleCopyText();
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedShareText)}`;
    window.open(url, "_blank");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://braingym-live.vercel.app")}&summary=${encodeURIComponent(formattedShareText)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://braingym-live.vercel.app")}&quote=${encodeURIComponent(formattedShareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              SHARE YOUR BRAINGYM REFLECTION
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-bold p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─── BRAINGYM BRANDED SHARE CARD PREVIEW ──────────────────────────── */}
        <div className="relative rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              TODAY&apos;S BRAINGYM REFLECTION
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                CHALLENGE
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                {challengeTitle}
              </h3>
            </div>

            <div className="rounded-2xl bg-background/90 border border-primary/20 p-3.5 space-y-1">
              <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                <Quote className="h-3 w-3" />
                MY BIGGEST TAKEAWAY
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTakeaway}
                  onChange={(e) => setEditedTakeaway(e.target.value)}
                  className="w-full text-xs sm:text-sm font-black text-foreground bg-card border border-border rounded-xl p-2 focus:border-primary focus:outline-none"
                />
              ) : (
                <p className="text-xs sm:text-sm font-black text-foreground italic">
                  &ldquo;{editedTakeaway}&rdquo;
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-background/70 border border-border p-3 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                MY REFLECTION &amp; ACTION
              </span>
              {isEditing ? (
                <textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  rows={2}
                  className="w-full text-xs text-foreground bg-card border border-border rounded-xl p-2 focus:border-primary focus:outline-none"
                />
              ) : (
                <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                  {editedNote}
                </p>
              )}
            </div>
          </div>

          {/* Footer Branding */}
          <div className="flex items-center justify-between pt-2 border-t border-primary/20 text-xs">
            <div className="space-y-0.5">
              <span className="font-black text-foreground block">BrainGym</span>
              <span className="text-[10px] text-muted-foreground">Train your mind. Improve your life.</span>
            </div>
            <span className="text-xs font-black text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
              Mental Fitness
            </span>
          </div>
        </div>

        {/* Edit Toggle */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>{isEditing ? "Save Edits & Preview" : "Edit Text Before Sharing"}</span>
          </button>
          <span className="text-[10px] text-muted-foreground">User-approved sharing only</span>
        </div>

        {/* ─── SOCIAL SHARE ACTIONS ─────────────────────────────────────────── */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Primary */}
          <button
            onClick={shareToWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 transition active:scale-95 min-h-[48px]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Share to WhatsApp Status / Chat</span>
          </button>

          {/* Grid of Other Channels */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shareToLinkedIn}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted py-2.5 px-2 text-xs font-bold text-foreground transition active:scale-95 min-h-[42px]"
            >
              <Linkedin className="h-3.5 w-3.5 text-blue-500" />
              <span>LinkedIn</span>
            </button>

            <button
              onClick={shareToFacebook}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted py-2.5 px-2 text-xs font-bold text-foreground transition active:scale-95 min-h-[42px]"
            >
              <Facebook className="h-3.5 w-3.5 text-indigo-500" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted py-2.5 px-2 text-xs font-bold text-foreground transition active:scale-95 min-h-[42px]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
              <span>{copied ? "Copied!" : "Copy Post"}</span>
            </button>
          </div>

          {/* Native Device Share */}
          <button
            onClick={handleNativeShare}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground py-2.5 px-4 text-xs font-bold transition active:scale-95 min-h-[40px]"
          >
            <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Device Share (Instagram, TikTok &amp; Others)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
