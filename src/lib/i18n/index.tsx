"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale, TranslationKeys } from "./types";
import { en } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";
import { zh } from "./zh";
import { pcm } from "./pcm";
import { pt } from "./pt";

const TRANSLATIONS: Record<Locale, TranslationKeys> = { en, fr, ar, zh, pcm, pt };

interface I18nContextValue {
  locale: Locale;
  t: TranslationKeys;
  isRtl: boolean;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
  isRtl: false,
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

function applyLocaleToDOM(loc: Locale) {
  if (typeof document !== "undefined") {
    const isArabic = loc === "ar";
    document.documentElement.lang = loc;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    if (isArabic) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("braingym_locale") as Locale | null;
    if (saved && TRANSLATIONS[saved]) {
      setLocaleState(saved);
      applyLocaleToDOM(saved);
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoaded(true); return; }
      supabase
        .from("user_settings")
        .select("locale")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.locale && TRANSLATIONS[data.locale as Locale]) {
            const userLocale = data.locale as Locale;
            setLocaleState(userLocale);
            applyLocaleToDOM(userLocale);
            localStorage.setItem("braingym_locale", userLocale);
          }
          setLoaded(true);
        });
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!TRANSLATIONS[newLocale]) return;
    setLocaleState(newLocale);
    applyLocaleToDOM(newLocale);
    localStorage.setItem("braingym_locale", newLocale);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("user_settings")
          .upsert({ user_id: user.id, locale: newLocale }, { onConflict: "user_id" });
      }
    });
  }, []);

  const isRtl = locale === "ar";

  return (
    <I18nContext.Provider value={{ locale, t: TRANSLATIONS[locale] || en, isRtl, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
