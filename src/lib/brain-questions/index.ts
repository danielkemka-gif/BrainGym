import type { BrainQuestion, BrainQuestionLocale } from "./types";
import { BRAIN_QUESTIONS_EN } from "./en";
import { BRAIN_QUESTIONS_PCM } from "./pcm";
import { BRAIN_QUESTIONS_EN_US } from "./en-us";
import { BRAIN_QUESTIONS_FR } from "./fr";
import { BRAIN_QUESTIONS_PT } from "./pt";

export type { BrainQuestion, BrainQuestionLocale };

const QUESTIONS_BY_LOCALE: Record<BrainQuestionLocale, BrainQuestion[]> = {
  en: BRAIN_QUESTIONS_EN,
  pcm: BRAIN_QUESTIONS_PCM,
  "en-us": BRAIN_QUESTIONS_EN_US,
  fr: BRAIN_QUESTIONS_FR,
  pt: BRAIN_QUESTIONS_PT,
};

export const QUIZ_LANGUAGES: { value: BrainQuestionLocale; label: string; flag: string; nativeLabel: string }[] = [
  { value: "en", label: "British English", flag: "🇬🇧", nativeLabel: "English (UK)" },
  { value: "en-us", label: "American English", flag: "🇺🇸", nativeLabel: "English (US)" },
  { value: "pcm", label: "Nigerian Pidgin", flag: "🇳🇬", nativeLabel: "Naijá" },
  { value: "fr", label: "French", flag: "🇫🇷", nativeLabel: "Français" },
  { value: "pt", label: "Portuguese", flag: "🇧🇷", nativeLabel: "Português" },
];

/**
 * Get brain questions for a specific locale.
 * Falls back to British English if locale not found.
 */
export function getBrainQuestions(locale: BrainQuestionLocale): BrainQuestion[] {
  return QUESTIONS_BY_LOCALE[locale] || QUESTIONS_BY_LOCALE.en;
}

/**
 * Get all available locales that have questions loaded.
 */
export function getAvailableLocales(): BrainQuestionLocale[] {
  return Object.keys(QUESTIONS_BY_LOCALE) as BrainQuestionLocale[];
}
