import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import HomePageClient from "@/src/components/home/home";

export const metadata: Metadata = generateMeta({
  title: "Home - USC Days 2025",
  description:
    "USC Days 2025 official website. Browse merchandise, view today's games, explore sports, and stay connected with intramural competitions.",
  url: "/",
  image: "/og_image.jpg",
});

export default function Home() {
  return <HomePageClient />;
}
