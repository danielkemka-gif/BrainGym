import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

let appUrl = "https://brain-gym-nsu6.vercel.app";
if (
  process.env.NEXT_PUBLIC_APP_URL &&
  process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
) {
  appUrl = process.env.NEXT_PUBLIC_APP_URL;
}

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "AKUCHE — Think Better. Decide Better. Live Better.",
  description:
    "When life gets complicated, think it through with Akuche. Your intelligent thinking, decision-making and action companion.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/icons/akuche-apple-touch.png",
  },
  openGraph: {
    title: "AKUCHE — Think Better. Decide Better. Live Better.",
    description:
      "When life gets complicated, think it through with Akuche. Think better, decide better, take action and grow intentionally.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AKUCHE",
      },
    ],
    type: "website",
    siteName: "AKUCHE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKUCHE — Think Better. Decide Better. Live Better.",
    description:
      "When life gets complicated, think it through with Akuche. Think better, decide better, take action and grow intentionally.",
    images: ["/og-image.png"],
  },
  other: {
    "msapplication-TileImage": "/logo.png",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "AKUCHE",
  },
};

export const viewport: Viewport = {
  themeColor: "#042F24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>AKUCHE — Think Better. Decide Better. Live Better.</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/akuche-apple-touch.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/akuche-apple-touch.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/akuche-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/akuche-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="AKUCHE" />
        <meta name="apple-mobile-web-app-title" content="AKUCHE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#042F24" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only z-[9999] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
