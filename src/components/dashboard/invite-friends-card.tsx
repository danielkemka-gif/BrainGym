'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  Share2,
  Copy,
  Check,
  Users,
  Gift,
  MessageCircle,
  Send,
  ExternalLink,
} from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://braingym.app';

interface ReferralInfo {
  code: string;
  count: number;
  coinsEarned: number;
}

export function InviteFriendsCard() {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadInfo = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code, referral_count')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.referral_code) {
        setInfo({
          code: profile.referral_code,
          count: profile.referral_count ?? 0,
          coinsEarned: (profile.referral_count ?? 0) * 100,
        });
      } else {
        const code = `BG${user.id.slice(0, 8).toUpperCase()}`;
        await supabase
          .from('profiles')
          .update({ referral_code: code })
          .eq('user_id', user.id);
        setInfo({ code, count: 0, coinsEarned: 0 });
      }
    } catch (err) {
      console.error('Failed to load referral info:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const inviteText = `Train your brain with me on BrainGym! 🧠 Join free and use my code: ${info?.code}`;
  const inviteUrl = `${APP_URL}/auth?ref=${info?.code}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select from a temp input
      const el = document.createElement('input');
      el.value = inviteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BrainGym',
          text: inviteText,
          url: inviteUrl,
        });
      } catch {
        // User cancelled — no-op
      }
    } else {
      copyLink();
    }
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteText + '\n' + inviteUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteText)}&url=${encodeURIComponent(inviteUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${encodeURIComponent(inviteText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(inviteText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 dark:from-violet-500/5 dark:via-purple-500/5 dark:to-fuchsia-500/5 backdrop-blur-sm border border-violet-200 dark:border-violet-800/50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Invite Friends</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Train together, earn bonus coins
            </p>
          </div>
        </div>
        {info.count > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
              {info.count}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">invited</div>
          </div>
        )}
      </div>

      {/* Referral code display */}
      <div className="mb-4 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-violet-200/50 dark:border-violet-800/30">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Your Invite Code
          </p>
          <p className="text-xl font-black tracking-[0.2em] text-violet-600 dark:text-violet-400 font-mono">
            {info.code}
          </p>
        </div>
      </div>

      {/* Copy link button */}
      <button
        onClick={copyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-medium text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 transition mb-3"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" /> Link copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> Copy invite link
          </>
        )}
      </button>

      {/* Platform share buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <ShareButton
          icon={<MessageCircle className="w-4 h-4" />}
          label="WhatsApp"
          color="bg-green-500 hover:bg-green-600"
          onClick={shareWhatsApp}
        />
        <ShareButton
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          }
          label="X"
          color="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100"
          onClick={shareTwitter}
        />
        <ShareButton
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          }
          label="Facebook"
          color="bg-blue-600 hover:bg-blue-700"
          onClick={shareFacebook}
        />
        <ShareButton
          icon={<Send className="w-4 h-4" />}
          label="Telegram"
          color="bg-sky-500 hover:bg-sky-600"
          onClick={shareTelegram}
        />
      </div>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={nativeShare}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium text-sm hover:opacity-90 transition mb-3"
        >
          <Share2 className="w-4 h-4" /> Share via...
        </button>
      )}

      {/* Stats footer */}
      {info.count > 0 && (
        <div className="flex items-center justify-center gap-4 pt-3 border-t border-violet-200/50 dark:border-violet-800/30">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="font-bold">{info.count}</span> friends joined
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Gift className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {info.coinsEarned}
            </span>{' '}
            coins earned
          </div>
        </div>
      )}

      {/* Motivation */}
      {info.count === 0 && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Share your code and you both get 100 bonus coins!
        </p>
      )}
    </motion.div>
  );
}

function ShareButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-white text-xs font-medium transition ${color}`}
      title={`Share on ${label}`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
