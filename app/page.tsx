import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import HomePageClient from "@/src/components/home/home";

export const metadata: Metadata = generateMeta({
  title: "Home - USC Days 2025",
  description:
    "View scores and results from USC Days 2025 intramural competitions. Follow your favorite teams across all sports.",
  url: "/",
  image: "/tc-logo-red.png",
});

export default function Home() {
  return <HomePageClient />;
}
