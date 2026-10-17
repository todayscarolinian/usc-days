import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import GamePage from "@/src/components/schedules/game-page";

export const metadata: Metadata = generateMeta({
  title: "Game Details - USC Days 2026",
  description: "Scores and details for a USC Days 2026 game.",
  url: "/schedules",
  image: "/og_image.jpg",
});

export default async function GamePageRoute({ params }: { params: Promise<{ gameId: string }> }) {
  const gameId = Number((await params).gameId);
  if (!Number.isInteger(gameId) || gameId <= 0) notFound();

  return <GamePage gameId={gameId} />;
}
