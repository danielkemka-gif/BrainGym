"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ShoppingCart,
  Snowflake,
  Zap,
  Brain,
  Crown,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { EmptyState } from "@/components/shared";
import { motion } from "framer-motion";
import Link from "next/link";

interface ShopItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  cost_coins: number;
  icon_emoji: string | null;
  effect_type: string;
  effect_value: Record<string, unknown>;
  is_active: boolean;
  max_purchases_per_user: number;
}

interface UserPurchase {
  item_id: string;
  coins_spent: number;
  purchased_at: string;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: ShoppingCart },
  { id: "powerup", label: "Power-ups", icon: Zap },
  { id: "cosmetic", label: "Cosmetics", icon: Sparkles },
  { id: "protection", label: "Protection", icon: Snowflake },
];

export default function CoinShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [coins, setCoins] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [itemsRes, purchasesRes, coinsRes] = await Promise.all([
      supabase
        .from("shop_items")
        .select("*")
        .eq("is_active", true)
        .order("cost_coins", { ascending: true }),
      supabase
        .from("user_purchases")
        .select("item_id, coins_spent, purchased_at")
        .eq("user_id", user.id),
      supabase
        .from("coins_ledger")
        .select("amount")
        .eq("user_id", user.id),
    ]);

    if (itemsRes.data) setItems(itemsRes.data as ShopItem[]);
    if (purchasesRes.data) setPurchases(purchasesRes.data as UserPurchase[]);
    if (coinsRes.data) {
      const total = coinsRes.data.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );
      setCoins(total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handlePurchase(item: ShopItem) {
    setMessage(null);
    setPurchasing(item.id);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage({ type: "error", text: "Not authenticated" });
      setPurchasing(null);
      return;
    }

    const { data: freshCoins } = await supabase
      .from("coins_ledger")
      .select("amount")
      .eq("user_id", user.id);

    const totalCoins = (freshCoins ?? []).reduce(
      (sum, e) => sum + e.amount,
      0
    );

    if (totalCoins < item.cost_coins) {
      setMessage({ type: "error", text: "Not enough coins" });
      setPurchasing(null);
      return;
    }

    const { error: purchaseErr } = await supabase
      .from("user_purchases")
      .insert({
        user_id: user.id,
        item_id: item.id,
        coins_spent: item.cost_coins,
      });

    if (purchaseErr) {
      setMessage({
        type: "error",
        text: "Purchase failed — you may already own this item",
      });
      setPurchasing(null);
      return;
    }

    if (item.effect_type === "streak_freeze") {
      const freezeCount =
        typeof item.effect_value?.count === "number"
          ? item.effect_value.count
          : 1;
      const { data: profile } = await supabase
        .from("profiles")
        .select("streak_freezes_remaining")
        .eq("user_id", user.id)
        .maybeSingle();
      const current = profile?.streak_freezes_remaining ?? 0;
      await supabase
        .from("profiles")
        .update({ streak_freezes_remaining: current + freezeCount })
        .eq("user_id", user.id);
    }

    await supabase.from("coins_ledger").insert({
      user_id: user.id,
      amount: -item.cost_coins,
      reason: "shop_purchase",
      reference_type: "shop_item",
      reference_id: item.id,
    });

    setMessage({
      type: "success",
      text: `Successfully purchased ${item.name}!`,
    });
    await fetchData();
    setPurchasing(null);
  }

  const ownedCount = (itemId: string) =>
    purchases.filter((p) => p.item_id === itemId).length;

  const isOwned = (item: ShopItem) =>
    item.max_purchases_per_user === 1 && ownedCount(item.id) > 0;

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const ownedItems = items.filter((i) => ownedCount(i.id) > 0);

  return (
    <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
              <h1 className="text-balance text-xl font-bold sm:text-2xl">Coin Shop</h1>
          <p className="text-sm text-muted-foreground">
            Spend your coins on power-ups, cosmetics, and protections
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-1.5 sm:px-4 sm:py-2">
          <span className="text-lg sm:text-xl">🪙</span>
          <span className="text-base font-bold sm:text-lg">{coins.toLocaleString()}</span>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${
            message.type === "success"
              ? "border-green-500/50 bg-green-500/10 text-green-500"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {message.text}
        </motion.div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.97] min-h-[44px] ${
                activeCategory === cat.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No items available"
          description="Check back later for new items"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => {
            const owned = isOwned(item);
            const canAfford = coins >= item.cost_coins;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{item.icon_emoji}</span>
                  {owned && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Check className="h-3 w-3" />
                      Owned
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold">{item.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-bold">
                    🪙 {item.cost_coins}
                  </span>
                  {owned ? (
                    <span className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      <Check className="h-3 w-3" />
                      Owned
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford || purchasing === item.id}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]"
                    >
                      {purchasing === item.id ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      ) : (
                        <ShoppingCart className="h-3 w-3" />
                      )}
                      Buy
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {ownedItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Purchases</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ownedItems.map((item, index) => {
              const count = ownedCount(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="text-2xl">{item.icon_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {count > 1 ? `${count}x purchased` : "1x purchased"}
                    </p>
                  </div>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
