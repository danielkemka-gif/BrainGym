import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKUCHE — Personal Clarity Intelligence",
    short_name: "AKUCHE",
    description:
      "Understand Better. Move Forward. Your personal clarity intelligence for navigating life, work, and business.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F7F9F5",
    theme_color: "#167A52",
    orientation: "any",
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
        name: "My Business",
        short_name: "Business",
        url: "/dashboard/business",
      },
      {
        name: "My Career",
        short_name: "Career",
        url: "/dashboard/career",
      },
      {
        name: "My Potential",
        short_name: "Potential",
        url: "/dashboard/potential",
      },
      {
        name: "My Life",
        short_name: "Life",
        url: "/dashboard/life",
      },
      {
        name: "Personal Clarity",
        short_name: "Clarity",
        url: "/dashboard/clarity",
      },
      {
        name: "Ask Akuche",
        short_name: "Ask",
        url: "/dashboard/ask",
      },
    ],
  };
}
