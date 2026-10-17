import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKUCHE — Train Your Mind. Transform Your Life.",
    short_name: "AKUCHE",
    description:
      "Akuche is an AI coach that trains the mind to make better decisions in business, relationships and everyday life.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F7F9F5",
    theme_color: "#167A52",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    prefer_related_applications: false,
    categories: ["education", "productivity", "lifestyle", "business"],
    icons: [
      {
        src: "/icons/akuche-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/akuche-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/akuche-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/akuche-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/akuche-apple-touch.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.png",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Train Mind",
        short_name: "Train",
        url: "/dashboard/daily-challenge",
      },
      {
        name: "Ask Akuche",
        short_name: "Ask",
        url: "/dashboard/ask",
      },
      {
        name: "Goals & Execution",
        short_name: "Goals",
        url: "/dashboard/goals",
      },
      {
        name: "Think Through",
        short_name: "Think",
        url: "/dashboard/think",
      },
      {
        name: "My Progress",
        short_name: "Progress",
        url: "/dashboard/progress",
      },
    ],
  };
}
