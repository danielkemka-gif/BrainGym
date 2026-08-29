import { DailyBrainDrop, SavedBrainCard } from "./types";

const STORAGE_KEY = "braingym_saved_brain_cards_v1";

export function getSavedBrainCards(): SavedBrainCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isCardSaved(cardIdOrDropId: string): boolean {
  const cards = getSavedBrainCards();
  return cards.some((c) => c.cardId === cardIdOrDropId || c.dropId === cardIdOrDropId);
}

export function saveBrainCard(drop: DailyBrainDrop): SavedBrainCard[] {
  const cards = getSavedBrainCards();
  if (cards.some((c) => c.cardId === drop.cardId || c.dropId === drop.id)) {
    return cards;
  }

  const newCard: SavedBrainCard = {
    cardId: drop.cardId,
    dropId: drop.id,
    title: drop.title,
    category: drop.category,
    discovery: drop.discovery,
    action: drop.useItToday.action,
    savedAt: new Date().toISOString(),
    masteryLevel: "new",
  };

  const updated = [newCard, ...cards];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function removeSavedCard(cardIdOrDropId: string): SavedBrainCard[] {
  const cards = getSavedBrainCards();
  const updated = cards.filter((c) => c.cardId !== cardIdOrDropId && c.dropId !== cardIdOrDropId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}
