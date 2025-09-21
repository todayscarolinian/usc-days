import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
// import Header from "@/components/Header/header";
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700'],
    variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
    title: "USC Days 2024 Scoreboard - Today's Carolinian",
    description:
        'Scoreboard of the different school teams per game for USC Days 2024',
    keywords: ['USC Days', 'scoreboard', 'sports', 'University of San Carlos', 'intramurals', 'competition'],
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
                <meta name="google-site-verification" content="fUlRQaR1gKTOPdr-F-kQFz3T4qAa1MM3fOrb2-s616Y" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body className={`${robotoCondensed.variable}`}>
                <Navbar />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
