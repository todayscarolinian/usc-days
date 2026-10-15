import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import Standings from "@/src/components/standings/standings";
import PageHero from "@/src/components/layout/page-hero";
import BasketballImage from "@/src/assets/carousel/bball.jpg";
import FlagImage from "@/src/assets/carousel/flag.jpg";
import TableTennisImage from "@/src/assets/carousel/table-tennis.jpg";
import VolleyballImage from "@/src/assets/carousel/vball.jpg";

export const metadata: Metadata = generateMeta({
  title: "Standings - USC Days 2026",
  description:
    "View the latest standings for USC Days 2026 intramural competitions.",
  url: "/standings",
  image: "/og_image.jpg",
});

const StandingsPage = () => {
  return (
    <>
      <PageHero
        eyebrow="USC Days 2026"
        title="Standings"
        images={[
            { src: BasketballImage, position: "center 25%" },
            { src: FlagImage, position: "center 20%" },
            { src: TableTennisImage, position: "center 45%" },
            { src: VolleyballImage, position: "center 48%" },
        ]}
      />

      <Suspense fallback={<div className="min-h-96 bg-neutral-50" />}>
        <Standings />
      </Suspense>
    </>
  );
};

export default StandingsPage;

/*

<Suspense fallback={<div />}>
  <Standings />
</Suspense>

*/
