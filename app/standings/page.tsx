import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import Standings from "@/src/components/standings/standings";

export const metadata: Metadata = generateMeta({
  title: "Standings - USC Days 2025",
  description:
    "View the latest standings for USC Days 2025 intramural competitions.",
  url: "/standings",
  image: "/og_image.jpg",
});

const StandingsPage = () => {
  return (
    <div>
      <Suspense fallback={<div />}>
        <Standings />
      </Suspense>
    </div>
  );
};

export default StandingsPage;
