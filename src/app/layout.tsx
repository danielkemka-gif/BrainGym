import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BrainGym — Train Your Brain For Real Life",
  description:
    "BrainGym helps you improve memory, focus, thinking, and emotional intelligence through daily real-life brain workouts.",
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "BrainGym — Train Your Brain For Real Life",
    description:
      "Improve your cognitive skills with daily real-life brain workouts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrainGym",
      },
    ],
    type: "website",
    siteName: "BrainGym",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainGym — Train Your Brain For Real Life",
    description:
      "Improve your cognitive skills with daily real-life brain workouts.",
    images: ["/og-image.png"],
  },
  other: {
    "msapplication-TileImage": "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
