import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import SchedulesPageClient from "@/src/components/schedules/schedules";
import PageHero from "@/src/components/layout/page-hero";
import BasketballImage from "@/src/assets/carousel/bball.jpg";
import FlagImage from "@/src/assets/carousel/flag.jpg";
import TableTennisImage from "@/src/assets/carousel/table-tennis.jpg";
import VolleyballImage from "@/src/assets/carousel/vball.jpg";

export const metadata: Metadata = generateMeta({
  title: "Game Schedules - USC Days 2026",
  description:
    "Check game schedules, live matches, and results for USC Days 2026.",
  url: "/schedules",
  image: "/og_image.jpg",
});

export default function SchedulesPage() {
  return (
    <>
      <PageHero
        eyebrow="USC Days 2026"
        title="Schedules"
        images={[
          { src: BasketballImage, position: "center 25%" },
          { src: FlagImage, position: "center 20%" },
          { src: TableTennisImage, position: "center 45%" },
          { src: VolleyballImage, position: "center 48%" },
        ]}
      />

      <Suspense fallback={<div />}>
        <SchedulesPageClient />
      </Suspense>
    </>
  );
}
