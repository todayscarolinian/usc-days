import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata: Metadata = generateMeta({
    title: "Leaderboard - USC Days 2025",
    description:
        "View the latest leaderboard standings for USC Days 2025 intramural competitions.",
    url: "/leaderboard",
    image: "/tc-logo-red.png",
});

export default function LeaderboardPage() {
    return <div></div>;
}
