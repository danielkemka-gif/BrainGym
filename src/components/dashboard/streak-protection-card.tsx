'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { purchaseStreakFreeze, type SmartReminder } from '@/lib/reminders';
import { createClient } from '@/lib/supabase/client';
import { Shield, Snowflake, Coins, ShoppingCart, Check } from 'lucide-react';

interface StreakFreezeInfo {
  freezesRemaining: number;
  freezesUsed: number;
  maxFreezes: number;
  coinsBalance: number;
}

export function StreakProtectionCard() {
  const [info, setInfo] = useState<StreakFreezeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const supabase = createClient();

  const loadInfo = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, coinsRes, purchasesRes] = await Promise.all([
        supabase.from('profiles').select('streak_freezes_remaining').eq('user_id', user.id).maybeSingle(),
        supabase.from('coins_ledger').select('amount').eq('user_id', user.id),
        supabase.from('streak_freeze_purchases').select('freeze_count, coins_spent').eq('user_id', user.id),
      ]);

      const freezes = profileRes.data?.streak_freezes_remaining ?? 0;
      const totalPurchased = purchasesRes.data?.reduce((s, p) => s + p.freeze_count, 0) ?? 0;
      const totalSpent = purchasesRes.data?.reduce((s, p) => s + p.coins_spent, 0) ?? 0;
      const coinsBalance = (coinsRes.data?.reduce((s, l) => s + l.amount, 0) ?? 0);

      setInfo({
        freezesRemaining: freezes,
        freezesUsed: Math.max(0, totalPurchased - freezes),
        maxFreezes: 5,
        coinsBalance,
      });
    } catch (err) {
      console.error('Failed to load streak info:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handlePurchase = async () => {
    if (!info || purchasing) return;
    setPurchasing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const cost = 50; // coins per freeze
      if (info.coinsBalance < cost) return;

      await purchaseStreakFreeze(user.id, 1, cost);
      setInfo((prev) => prev ? {
        ...prev,
        freezesRemaining: prev.freezesRemaining + 1,
        coinsBalance: prev.coinsBalance - cost,
      } : prev);
    } catch (err) {
      console.error('Failed to purchase freeze:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Streak Protection</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Freeze your streak before it melts</p>
        </div>
      </div>

      {/* Freeze status */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Snowflake className="w-4 h-4 text-cyan-500" />
            <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{info.freezesRemaining}</span>
          </div>
          <div className="text-xs text-cyan-500 dark:text-cyan-400">Freezes left</div>
        </div>
        <div className="flex-1 text-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{info.coinsBalance}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Coins</div>
        </div>
      </div>

      {/* Max indicator */}
      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: info.maxFreezes }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < info.freezesRemaining
                ? 'bg-cyan-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{info.freezesRemaining}/{info.maxFreezes}</span>
      </div>

      {/* Purchase button */}
      <button
        onClick={handlePurchase}
        disabled={purchasing || info.freezesRemaining >= info.maxFreezes || info.coinsBalance < 50}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {purchasing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Purchasing...
          </span>
        ) : info.freezesRemaining >= info.maxFreezes ? (
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> Maximum freezes reached
          </span>
        ) : info.coinsBalance < 50 ? (
          <span className="flex items-center gap-2">
            <Coins className="w-4 h-4" /> Not enough coins (need 50)
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Buy 1 Freeze — 50 Coins
          </span>
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        Each freeze protects your streak for 1 day. Max 5 at a time.
      </p>
    </motion.div>
  );
}
