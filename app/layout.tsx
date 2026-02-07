import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import { Toaster } from "@/src/components/ui/sonner";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import QueryProvider from "@/src/components/provider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from '@next/third-parties/google'

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://uscdays.todayscarolinian.com/",
  ),
  ...generateMeta({
    title: "USC Days 2025 Scoreboard - Today's Carolinian",
    description:
      "Scoreboard of the different school teams per game for USC Days 2025",
    url: "/",
    image: "/tc-logo-red.png",
  }),
  keywords: [
    "USC Days",
    "scoreboard",
    "sports",
    "University of San Carlos",
    "intramurals",
    "competition",
  ],
  authors: [{ name: "Today's Carolinian" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8B1538" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${robotoCondensed.variable}`}>
        <QueryProvider>
          <Suspense fallback={<div />}>
            <Navbar />
          </Suspense>
          <main className="relative z-0">{children}</main>
          <Toaster />
              </QueryProvider>
              <GoogleAnalytics gaId="G-ZF7QYY6WNC" />
        <Analytics />
      </body>
    </html>
  );
}
