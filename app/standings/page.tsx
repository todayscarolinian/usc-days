import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import Standings from "@/src/components/standings/standings";
import PageHero from "@/src/components/layout/page-hero";

export const metadata: Metadata = generateMeta({
  title: "Standings - USC Days 2025",
  description:
    "View the latest standings for USC Days 2025 intramural competitions.",
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
            { src: "/carousel/bball.jpg", position: "center 25%" },
            { src: "/carousel/flag.jpg", position: "center 20%" },
            { src: "/carousel/table-tennis.jpg", position: "center 45%" },
            { src: "/carousel/vball.jpg", position: "center 48%" },
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