import HeroCarousel from "./hero-carousel";
import MatchdayBanner from "./matchday-banner";
import MerchSection from "./merch-section";
import TodaysGames from "./todays-games";
import SportsSection from "./sports-section";
import NewsSection from "./news-section";
import LeaderboardSection from "./leaderboard-section";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import RangerCarousel from "@/app/components/RangerCarousel/RangerCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/white-bg.png')] bg-top bg-repeat text-slate-900">
      <HeroCarousel />

      <main className="mx-auto max-w-[1600px] px-3 py-12 space-y-12">
        <NewsSection
          hashtag={FACEBOOK_NEWS_CONFIG.hashtag?.trim() || undefined}
        />
      </main>

      <div className="space-y-8 sm:space-y-12">
        <MatchdayBanner />

          <main className="mx-auto max-w-[1600px] px-3 py-8">
            <section
              id="todays-games"
              aria-labelledby="todays-games-heading"
              className="flex min-h-[calc(100svh-4rem)] w-full flex-col"
            >
              <TodaysGames />
          </section>
        </main>

        <div>
          <section id="sports" aria-labelledby="sports-heading">
            <SportsSection />
          </section>

          <RangerCarousel>
            <div className="mx-auto w-full max-w-[1600px] shrink-0 px-3 text-center">
              <h2
                id="schools-heading"
                className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl"
              >
                Meet the Schools
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Get to know the different schools and departments that make up
                our Carolinian community. Discover their unique identities,
                programs, and what makes each one stand out.
              </p>
            </div>
          </RangerCarousel>

          <LeaderboardSection />
        </div>

        <main className="mx-auto max-w-[1600px] px-3 py-8 space-y-12">
          <section id="featured-merch" aria-labelledby="featured-merch">
            <MerchSection />
          </section>
        </main>
      </div>
    </div>
  );
}
