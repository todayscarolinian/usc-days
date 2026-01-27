import HeroCarousel from "./hero-carousel";
import MerchSection from "./merch-section";
import TodaysGames from "./todays-games";
import SportsSection from "./sports-section";
import ContactSection from "./contact-section";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-900">
        <HeroCarousel />

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