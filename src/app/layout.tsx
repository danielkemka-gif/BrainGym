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
    "When life gets complicated, think it through with Akuche. Your intelligent personal thinking, decision-making and action companion.",
  manifest: "/manifest.json?v=9.0.0",
  icons: {
    icon: [
      { url: "/favicon.svg?v=9.0.0", type: "image/svg+xml" },
      { url: "/favicon.png?v=9.0.0", type: "image/png" },
    ],
    apple: "/icons/akuche-apple-touch.png?v=9.0.0",
  },
  openGraph: {
    title: "AKUCHE — Think Better. Decide Better. Live Better.",
    description:
      "When life gets complicated, think it through with Akuche. Think better, decide better, take action and grow intentionally.",
    images: [
      {
        url: "/og-image-v9.png?v=9.0.0",
        width: 1200,
        height: 630,
        alt: "AKUCHE — Think Better. Decide Better. Live Better.",
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
    images: ["/og-image-v9.png?v=9.0.0"],
  },
  other: {
    "msapplication-TileImage": "/logo.png?v=9.0.0",
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=9.0.0" />
        <link rel="icon" type="image/png" href="/favicon.png?v=9.0.0" />
        <link rel="shortcut icon" href="/favicon.ico?v=9.0.0" />
        <link rel="apple-touch-icon" href="/icons/akuche-apple-touch.png?v=9.0.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/akuche-apple-touch.png?v=9.0.0" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/akuche-192.png?v=9.0.0" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/akuche-512.png?v=9.0.0" />
        <link rel="manifest" href="/manifest.json?v=9.0.0" />
        <meta property="og:image" content="/og-image-v9.png?v=9.0.0" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="/og-image-v9.png?v=9.0.0" />
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
