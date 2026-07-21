import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BrainGym — Train Your Brain For Real Life",
  description:
    "BrainGym helps you improve memory, focus, thinking, and emotional intelligence through daily real-life brain workouts.",
  openGraph: {
    title: "BrainGym — Train Your Brain For Real Life",
    description:
      "Improve your cognitive skills with daily real-life brain workouts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
