import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import SchedulesPageClient from "@/src/components/schedules/schedules";

export const metadata: Metadata = generateMeta({
  title: "Game Schedules - USC Days 2025",
  description:
    "Check upcoming game schedules for USC Days 2025. Never miss a match with our comprehensive schedule overview.",
  url: "/schedules",
  image: "/tc-logo-red.png",
});

export default function SchedulesPage() {
  return (
    <div>
      <SchedulesPageClient />
    </div>
  );
}
