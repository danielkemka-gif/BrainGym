"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BrandKey = "akuche" | "braingym";

export interface BrandInfo {
  key: BrandKey;
  name: string;
  shortName: string;
  tagline: string;
  secondaryTagline: string;
  corePhilosophy: string;
  coreFramework: string;
  coreDifferentiation: string;
  logoUrl: string;
  badgeText: string;
}

export const BRAND_DEFINITIONS: Record<BrandKey, BrandInfo> = {
  akuche: {
    key: "akuche",
    name: "AKUCHE",
    shortName: "AKUCHE",
    tagline: "Think Better. Decide Better. Live Better.",
    secondaryTagline: "When life gets complicated, think it through with Akuche.",
    corePhilosophy: "Situation → Understand → Analyse → Reflect → Explore Options → Decide → Act → Follow Up",
    coreFramework: "A-K-U-C-H-E (Assess, Know, Understand, Consider, Choose, Execute)",
    coreDifferentiation: "ChatGPT gives you answers. AKUCHE trains your mind to understand, evaluate, decide and execute.",
    logoUrl: "/akuche-logo.svg",
    badgeText: "THINK BETTER. DECIDE BETTER. LIVE BETTER.",
  },
  braingym: {
    key: "braingym",
    name: "BrainGym",
    shortName: "BrainGym",
    tagline: "Train Your Mind. Solve Real Problems.",
    secondaryTagline: "People go to the gym to strengthen their bodies. BrainGym helps people strengthen their minds.",
    corePhilosophy: "THINK → DECIDE → ACT → REFLECT",
    coreFramework: "THINK → DECIDE → ACT → REFLECT",
    coreDifferentiation: "ChatGPT can give you an answer. BrainGym helps you become better at finding, evaluating and applying answers.",
    logoUrl: "/braingym-logo.png",
    badgeText: "THE DAILY GYM FOR YOUR MIND",
  },
};

interface BrandContextType {
  brand: BrandInfo;
  brandKey: BrandKey;
  setBrandKey: (key: BrandKey) => void;
  toggleBrand: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const STORAGE_KEY = "akuche_brand_theme";

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandKey, setBrandKeyState] = useState<BrandKey>("akuche");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as BrandKey | null;
      if (stored && (stored === "akuche" || stored === "braingym")) {
        setBrandKeyState(stored);
      }
    } catch {
      // localStorage may fail in private mode
    }
    setMounted(true);
  }, []);

  const setBrandKey = (key: BrandKey) => {
    setBrandKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
      window.dispatchEvent(new CustomEvent("akuche:brand-changed", { detail: key }));
      
      // Update favicon and apple touch icon dynamically
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = key === "braingym" ? "/braingym-logo.png" : "/favicon.png";
      }
      const appleTouch = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (appleTouch) {
        appleTouch.href = key === "braingym" ? "/braingym-logo.png" : "/logo.png";
      }
    } catch {
      // ignore
    }
  };

  const toggleBrand = () => {
    setBrandKey(brandKey === "akuche" ? "braingym" : "akuche");
  };

  const currentBrand = BRAND_DEFINITIONS[brandKey] || BRAND_DEFINITIONS.akuche;

  return (
    <BrandContext.Provider
      value={{
        brand: currentBrand,
        brandKey,
        setBrandKey,
        toggleBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      brand: BRAND_DEFINITIONS.akuche,
      brandKey: "akuche" as BrandKey,
      setBrandKey: () => {},
      toggleBrand: () => {},
    };
  }
  return context;
}
