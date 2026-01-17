"use client";

import React from "react";
import HeroSlideshow from "./hero-slideshow";
import MerchSection from "./merch-section";
import TodaysGames from "./todays-games";
import SportsSection from "./sports-section";
import ContactSection from "./contact-section";
import FeedbackLink from "./feedback-link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
        <HeroSlideshow />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">

        <section id="featured-merch" aria-labelledby="featured-merch">
          <MerchSection />
        </section>

        <section id="todays-games" aria-labelledby="todays-games">
          <TodaysGames />
        </section>

        <section id="sports" aria-labelledby="sports">
          <SportsSection />
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact" className="text-2xl font-semibold">
            Contact & Feedback
          </h2>
          <ContactSection />
          <FeedbackLink />
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} USC Days — Scores • Schedules • Teams
        </div>
      </footer>
    </div>
  );
}