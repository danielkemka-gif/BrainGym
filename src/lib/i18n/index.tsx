"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale, TranslationKeys } from "./types";
import { en } from "./en";
import { pcm } from "./pcm";
import { fr } from "./fr";
import { pt } from "./pt";

const TRANSLATIONS: Record<Locale, TranslationKeys> = { en, pcm, fr, pt };

interface I18nContextValue {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("braingym_locale") as Locale | null;
    if (saved && TRANSLATIONS[saved]) {
      setLocaleState(saved);
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
            setLocaleState(data.locale as Locale);
            localStorage.setItem("braingym_locale", data.locale);
          }
          setLoaded(true);
        });
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
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

  return (
    <I18nContext.Provider value={{ locale, t: TRANSLATIONS[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
