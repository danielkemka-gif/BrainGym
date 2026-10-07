"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BrandKey = "akuche";

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

export const BRAND_DEFINITIONS: Record<string, BrandInfo> = {
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
  const [brandKey] = useState<BrandKey>("akuche");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "akuche");
      
      // Force update favicon and apple touch icon dynamically
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = "/favicon.png?v=7.0.0";
      }
      const appleTouch = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (appleTouch) {
        appleTouch.href = "/icons/akuche-apple-touch.png?v=7.0.0";
      }
    } catch {
      // ignore
    }
  }, []);

  const currentBrand = BRAND_DEFINITIONS.akuche;

  return (
    <BrandContext.Provider
      value={{
        brand: currentBrand,
        brandKey: "akuche",
        setBrandKey: () => {},
        toggleBrand: () => {},
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    return {
      brand: BRAND_DEFINITIONS.akuche,
      brandKey: "akuche" as BrandKey,
      setBrandKey: () => {},
      toggleBrand: () => {},
    };
  }
  return context;
}
