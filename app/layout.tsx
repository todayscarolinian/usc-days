import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Suspense } from "react";
import "lenis/dist/lenis.css";
import "./globals.css";
import OpeningScreen from "@/src/components/home/opening-screen";
import Navbar from "@/src/components/layout/navbar";
import SiteFooter from "@/src/components/layout/site-footer";
import SmoothScroll from "@/src/components/layout/smooth-scroll";
import { Toaster } from "@/src/components/ui/sonner";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import QueryProvider from "@/src/components/provider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from '@next/third-parties/google'

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
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
    image: "/og_image.jpg",
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
        <style id="tc-intro-session">{"/* Session visibility is applied through CSSOM before first paint. */"}</style>
        <script dangerouslySetInnerHTML={{ __html: `try{var tcSheet=document.getElementById("tc-intro-session").sheet;if(sessionStorage.getItem("usc-days-intro-seen")==="1"){tcSheet.insertRule("dialog[data-tc-opening]{display:none}",0)}if(sessionStorage.getItem("usc-days-hero-seen")==="1"){tcSheet.insertRule("#site-hero [data-hero-title]{animation:none;transform:none}",0)}}catch{}` }} />
        <meta name="theme-color" content="#8B1538" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${robotoCondensed.variable} flex min-h-dvh flex-col`}>
        <OpeningScreen />
        <SmoothScroll />
        <QueryProvider>
          <Suspense fallback={<div />}>
            <Navbar />
          </Suspense>
          <main className="relative z-0 flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
              </QueryProvider>
              <GoogleAnalytics gaId="G-ZF7QYY6WNC" />
        <Analytics />
      </body>
    </html>
  );
}
