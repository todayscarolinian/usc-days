import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import Leaderboards from "@/src/components/leaderboards/leaderboards";
import PageHero from "@/src/components/layout/page-hero";
import BasketballImage from "@/src/assets/carousel/bball.jpg";
import FlagImage from "@/src/assets/carousel/flag.jpg";
import TableTennisImage from "@/src/assets/carousel/table-tennis.jpg";
import VolleyballImage from "@/src/assets/carousel/vball.jpg";

export const metadata: Metadata = generateMeta({
  title: "Leaderboards - USC Days 2026",
  description:
    "Explore the leaderboards for USC Days 2026 intramural competitions and see how the different teams rank.",
  url: "/leaderboards",
  image: "/og_image.jpg",
});

const LeaderboardsPage = () => {
  return (
    <>
      <PageHero
        eyebrow="USC Days 2026"
        title="Leaderboards"
        images={[
          { src: BasketballImage, position: "center 25%" },
          { src: FlagImage, position: "center 20%" },
          { src: TableTennisImage, position: "center 45%" },
          { src: VolleyballImage, position: "center 48%" },
        ]}
      />

      <Suspense fallback={<div />}>
        <Leaderboards />
      </Suspense>
    </>
  );
};

export default LeaderboardsPage;
