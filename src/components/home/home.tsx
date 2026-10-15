import HeroCarousel from "./hero-carousel";
import MerchSection from "./merch-section";
import TodaysGames from "./todays-games";
import SportsSection from "./sports-section";
import ContactSection from "./contact-section";
import SchoolsSection from "./schools-section";
import NewsSection from "./news-section";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import RangerCarousel from "@/app/components/RangerCarousel/RangerCarousel";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-900">
      <HeroCarousel />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <NewsSection
          hashtag={FACEBOOK_NEWS_CONFIG.hashtag?.trim() || undefined}
        />

        <section id="featured-merch" aria-labelledby="featured-merch">
          <MerchSection />
        </section>

        <section id="todays-games" aria-labelledby="todays-games">
          <TodaysGames />
        </section>

        <section id="schools" aria-labelledby="schools">
          <SchoolsSection />
        </section>

        <section id="sports" aria-labelledby="sports">
          <SportsSection />
        </section>
      </main>

      <main className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-white">
        <section className="w-full px-6 pt-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-6xl">
            Meet the Schools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
            Get to know the different schools and departments that make up our
            Carolinian community. Discover their unique identities, programs,
            and what makes each one stand out.
          </p>
        </section>
        <section className="flex w-full items-center justify-center py-12">
          <RangerCarousel />
        </section>
      </main>

      <footer className="border-t bg-tc_primary mt-6">
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
          <section id="contact" aria-labelledby="contact">
            <ContactSection />
          </section>
        </div>
      </footer>
    </div>
  );
}
