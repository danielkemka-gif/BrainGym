"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LOCALES, Locale } from "@/lib/i18n/types";
import { Globe, Check, Sparkles } from "lucide-react";

export function LanguageSettingsSection() {
  const { locale, setLocale, t, isRtl } = useI18n();
  const [justSaved, setJustSaved] = useState(false);

  const handleSelectLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className={`rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">{t.settings_language}</h3>
            <p className="text-xs text-muted-foreground">{t.settings_language_desc}</p>
          </div>
        </div>

        {justSaved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <Check className="h-3.5 w-3.5" />
            <span>{t.settings_saved}</span>
          </span>
        )}
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {LOCALES.map((loc) => {
          const isSelected = locale === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectLocale(loc.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition active:scale-[0.99] text-left ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-background/80 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{loc.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-foreground">
                      {loc.nativeLabel}
                    </span>
                    {loc.dir === "rtl" && (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-black text-amber-600 dark:text-amber-400">
                        RTL
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {loc.label}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
