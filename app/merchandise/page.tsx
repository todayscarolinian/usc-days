import { Suspense } from "react";
import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import MerchandiseSection from "@/src/components/merchandise/merchandise-section";
import PageHero from "@/src/components/layout/page-hero";
import BasketballImage from "@/src/assets/carousel/bball.jpg";
import FlagImage from "@/src/assets/carousel/flag.jpg";
import TableTennisImage from "@/src/assets/carousel/table-tennis.jpg";
import VolleyballImage from "@/src/assets/carousel/vball.jpg";

export const metadata: Metadata = generateMeta({
  title: "Merchandise - USC Days 2026",
  description:
    "Browse merchandise by category for USC Days 2026. Find apparel, accessories, and more to show your school spirit.",
  url: "/merchandise",
  image: "/og_image.jpg",
});

export default function MerchandisePage() {
  return (
    <>
      <PageHero
        eyebrow="USC Days 2026"
        title="Merchandise"
        images={[
          { src: BasketballImage, position: "center 25%" },
          { src: FlagImage, position: "center 20%" },
          { src: TableTennisImage, position: "center 45%" },
          { src: VolleyballImage, position: "center 48%" },
        ]}
      />

      <Suspense>
        <MerchandiseSection />
      </Suspense>
    </>
  );
}
