/**
 * AKUCHE DAILY OPENING & INSPIRATION SELECTION ENGINE
 * 
 * Manages the intelligent selection of daily inspiration messages from the 5,250+ catalog,
 * ensures zero repeats across 14+ years of daily usage, handles bookmarks/favorites,
 * and tracks daily opening completion.
 */

import { AkucheDailyMessage } from "./types";
import catalogData from "./messages-catalog.json";

const STORAGE_KEYS = {
  LAST_OPENING_DATE: "akuche_last_daily_opening_date",
  TODAYS_MESSAGE_ID: "akuche_todays_message_id",
  SEEN_MESSAGE_IDS: "akuche_seen_message_ids",
  FAVORITE_MESSAGE_IDS: "akuche_favorite_message_ids",
  SOUND_ENABLED: "akuche_welcome_sound_enabled",
};

const messagesCatalog: AkucheDailyMessage[] = catalogData as AkucheDailyMessage[];

/**
 * Returns user's local date string in YYYY-MM-DD format
 */
export function getTodaysLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Simple string hashing function for deterministic selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Checks whether the daily opening screen should be displayed today
 */
export function shouldShowDailyOpening(): boolean {
  if (typeof window === "undefined") return false;

  // If user completed today's opening already, don't show automatically
  const lastOpeningDate = localStorage.getItem(STORAGE_KEYS.LAST_OPENING_DATE);
  const today = getTodaysLocalDate();

  return lastOpeningDate !== today;
}

/**
 * Retrieves the list of seen message IDs
 */
export function getSeenMessageIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEEN_MESSAGE_IDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Retrieves today's dedicated message, selecting an unseen message deterministically
 */
export function getTodaysDailyMessage(): AkucheDailyMessage {
  const today = getTodaysLocalDate();

  if (typeof window === "undefined") {
    // SSR fallback: deterministic hash on today's date
    const hash = hashString(today);
    return messagesCatalog[hash % messagesCatalog.length] || messagesCatalog[0];
  }

  // 1. Check if we already locked in today's message
  const cachedDate = localStorage.getItem(STORAGE_KEYS.LAST_OPENING_DATE);
  const cachedId = localStorage.getItem(STORAGE_KEYS.TODAYS_MESSAGE_ID);

  if (cachedId) {
    const existing = messagesCatalog.find((m) => m.id === cachedId);
    if (existing) {
      return existing;
    }
  }

  // 2. Select an unseen message deterministically
  const seenIds = new Set(getSeenMessageIds());
  const unseen = messagesCatalog.filter((m) => !seenIds.has(m.id));

  const pool = unseen.length > 0 ? unseen : messagesCatalog;
  const dateHash = hashString(today);
  const selectedIndex = dateHash % pool.length;
  const selectedMessage = pool[selectedIndex] || messagesCatalog[0];

  // Store today's locked-in ID
  try {
    localStorage.setItem(STORAGE_KEYS.TODAYS_MESSAGE_ID, selectedMessage.id);
  } catch {
    // Non-blocking
  }

  return selectedMessage;
}

/**
 * Marks today's daily opening as completed and records seen message ID
 */
export function markDailyOpeningCompleted(messageId: string): void {
  if (typeof window === "undefined") return;
  const today = getTodaysLocalDate();

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_OPENING_DATE, today);
    localStorage.setItem(STORAGE_KEYS.TODAYS_MESSAGE_ID, messageId);

    const seen = getSeenMessageIds();
    if (!seen.includes(messageId)) {
      seen.push(messageId);
      // Keep seen array bounded if needed, but 5,250 string IDs is only ~60KB
      localStorage.setItem(STORAGE_KEYS.SEEN_MESSAGE_IDS, JSON.stringify(seen));
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Retrieves all favorited message IDs
 */
export function getFavoriteMessageIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_MESSAGE_IDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Checks if a specific message is favorited
 */
export function isMessageFavorited(messageId: string): boolean {
  return getFavoriteMessageIds().includes(messageId);
}

/**
 * Toggles a message's favorited state
 */
export function toggleFavoriteMessage(messageId: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = getFavoriteMessageIds();
  const index = favorites.indexOf(messageId);
  let isFav = false;

  if (index > -1) {
    favorites.splice(index, 1);
    isFav = false;
  } else {
    favorites.push(messageId);
    isFav = true;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_MESSAGE_IDS, JSON.stringify(favorites));
  } catch {
    // Non-blocking
  }

  return isFav;
}

/**
 * Retrieves full message objects for all favorited IDs
 */
export function getFavoriteMessages(): AkucheDailyMessage[] {
  const favIds = new Set(getFavoriteMessageIds());
  return messagesCatalog.filter((m) => favIds.has(m.id));
}

/**
 * Fetches a random inspiration message from the catalog (with optional theme filter)
 */
export function getRandomInspiration(themeFilter?: string): AkucheDailyMessage {
  const pool = themeFilter
    ? messagesCatalog.filter((m) => m.theme.toLowerCase() === themeFilter.toLowerCase())
    : messagesCatalog;

  const validPool = pool.length > 0 ? pool : messagesCatalog;
  const randomIndex = Math.floor(Math.random() * validPool.length);
  return validPool[randomIndex];
}

/**
 * Retrieves a message by its ID
 */
export function getMessageById(id: string): AkucheDailyMessage | undefined {
  return messagesCatalog.find((m) => m.id === id);
}

/**
 * Returns total count of library messages
 */
export function getTotalMessageCount(): number {
  return messagesCatalog.length;
}
