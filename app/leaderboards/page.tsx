import { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import Leaderboards from "@/src/components/leaderboards/leaderboards";

export const metadata: Metadata = generateMeta({
  title: "Leaderboards - USC Days 2025",
  description:
    "Explore the leaderboards for USC Days 2025 intramural competitions and see how the different teams rank.",
  url: "/leaderboards",
  image: "/tc-logo-red.png",
});

const LeaderboardsPage = () => {
  return (
    <Suspense fallback={<div />}>
      <Leaderboards />
    </Suspense>
  );
};

export default LeaderboardsPage;
