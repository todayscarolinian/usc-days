import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import HomePageClient from "@/src/components/home/home";
import RangerCarousel from "./components/RangerCarousel/RangerCarousel";

export const metadata: Metadata = generateMeta({
  title: "Home - USC Days 2025",
  description:
    "USC Days 2025 official website. Browse merchandise, view today's games, explore sports, and stay connected with intramural competitions.",
  url: "/",
  image: "/og_image.jpg",
});

export default function Home() {
  return (
    <>
      <HomePageClient />
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
    </>
  );
}
