import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import SchedulesPageClient from "@/src/components/schedules/schedules";

export const metadata: Metadata = generateMeta({
  title: "Game Schedules - USC Days 2026",
  description:
    "Check game schedules, live matches, and results for USC Days 2026.",
  url: "/schedules",
  image: "/og_image.jpg",
});

export default function SchedulesPage() {
  return (
    <div>
      <Suspense fallback={<div />}>
        <SchedulesPageClient />
      </Suspense>
    </div>
  );
}
