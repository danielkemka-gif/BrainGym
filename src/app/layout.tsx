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
  title: "AKUCHE — More Than Answers. Intelligence That Moves You Forward.",
  description:
    "Personal Clarity Intelligence for navigating life, work, and business. Understand. Think. Decide. Act. Grow.",
  manifest: "/manifest.json?v=24.0.0",
  icons: {
    icon: [
      { url: "/favicon.svg?v=24.0.0", type: "image/svg+xml" },
      { url: "/favicon.png?v=24.0.0", type: "image/png" },
    ],
    apple: "/icons/akuche-apple-touch.png?v=24.0.0",
  },
  openGraph: {
    title: "AKUCHE — More Than Answers. Intelligence That Moves You Forward.",
    description:
      "Personal Clarity Intelligence for navigating life, work, and business. Understand. Think. Decide. Act. Grow.",
    images: [
      {
        url: "/og-image-v9.png?v=24.0.0",
        width: 1200,
        height: 630,
        alt: "AKUCHE — Personal Clarity Intelligence",
      },
    ],
    type: "website",
    siteName: "AKUCHE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKUCHE — More Than Answers. Intelligence That Moves You Forward.",
    description:
      "Personal Clarity Intelligence for navigating life, work, and business. Understand. Think. Decide. Act. Grow.",
    images: ["/og-image-v9.png?v=24.0.0"],
  },
  other: {
    "msapplication-TileImage": "/logo.png?v=24.0.0",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AKUCHE — More Than Answers. Intelligence That Moves You Forward.</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=24.0.0" />
        <link rel="icon" type="image/png" href="/favicon.png?v=24.0.0" />
        <link rel="shortcut icon" href="/favicon.ico?v=24.0.0" />
        <link rel="apple-touch-icon" href="/icons/akuche-apple-touch.png?v=24.0.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/akuche-apple-touch.png?v=24.0.0" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/akuche-192.png?v=24.0.0" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/akuche-512.png?v=24.0.0" />
        <link rel="manifest" href="/manifest.json?v=24.0.0" />
        <meta property="og:image" content="/og-image-v9.png?v=24.0.0" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="/og-image-v9.png?v=24.0.0" />
        <meta name="application-name" content="AKUCHE" />
        <meta name="apple-mobile-web-app-title" content="AKUCHE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#042F24" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#042F24" media="(prefers-color-scheme: light)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("akuche-theme")||localStorage.getItem("braingym-theme");var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d){r.classList.add("dark");r.classList.remove("light");}else{r.classList.remove("dark");r.classList.add("light");}}catch(e){}})();`,
          }}
        />
        {/* Instant Mobile URL Cache Reset Handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.location.search.indexOf('reset')!==-1||window.location.search.indexOf('clear')!==-1){if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){for(var i=0;i<regs.length;i++){regs[i].unregister();}});}if('caches' in window){caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));});}if('sessionStorage' in window){sessionStorage.clear();}window.history.replaceState({},document.title,window.location.pathname);window.location.reload();}}catch(e){}})();`,
          }}
        />
        {/* PWA & Mobile WebAPK ChunkLoadError Auto-Recovery Guard */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              function handleChunkFailure(e){
                var msg = (e && (e.message || (e.reason && e.reason.message))) || '';
                if (msg.indexOf('Loading chunk') !== -1 || msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Failed to fetch dynamically imported module') !== -1) {
                  if (!sessionStorage.getItem('akuche_chunk_recovered')) {
                    sessionStorage.setItem('akuche_chunk_recovered', 'true');
                    if ('caches' in window) {
                      caches.keys().then(function(keys){
                        return Promise.all(keys.map(function(k){ return caches.delete(k); }));
                      }).finally(function(){ window.location.reload(); });
                    } else {
                      window.location.reload();
                    }
                  }
                }
              }
              window.addEventListener('error', handleChunkFailure);
              window.addEventListener('unhandledrejection', handleChunkFailure);
            })();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-dvh selection:bg-primary/20`}>
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
