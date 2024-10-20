import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
// import Header from "@/components/Header/header";
import Navbar from "@/components/layout/navbar";

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700'],
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  title: "USC Days 2023 Scoreboard - Today's Carolinian",
  description: "Scoreboard of the different school teams per game for USC Days 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${robotoCondensed.variable}`}
        >
          <Navbar />
          {children}
        </body>
    </html>
  );
}
