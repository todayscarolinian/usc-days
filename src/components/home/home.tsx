import HeroCarousel from "./hero-carousel";
import MerchSection from "./merch-section";
import TodaysGames from "./todays-games";
import SportsSection from "./sports-section";
import NewsSection from "./news-section";
import LeaderboardSection from "./leaderboard-section";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import RangerCarousel from "@/app/components/RangerCarousel/RangerCarousel";
import StandingsSection from "@/app/components/StandingsSection/StandingsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/white-bg.png')] bg-top bg-repeat text-slate-900">
      <HeroCarousel />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section id="todays-games" aria-labelledby="todays-games">
          <TodaysGames />
        </section>
      </main>
        
      <StandingsSection />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <NewsSection
          hashtag={FACEBOOK_NEWS_CONFIG.hashtag?.trim() || undefined}
        />
      </main>

      <section id="sports" aria-labelledby="sports-heading">
        <SportsSection />
      </section>

      <section
        id="schools"
        aria-labelledby="schools-heading"
        className="schools-section w-full bg-white"
      >
        <div className="w-full shrink-0 px-6 text-center">
          <h2 id="schools-heading" className="text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Meet the Schools
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            Get to know the different schools and departments that make up our
            Carolinian community. Discover their unique identities, programs,
            and what makes each one stand out.
          </p>
        </div>
        <div className="schools-carousel">
          <RangerCarousel />
        </div>
      </section>

      <LeaderboardSection />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section id="featured-merch" aria-labelledby="featured-merch">
          <MerchSection />
        </section>
      </main>
    </div>
  );
}
