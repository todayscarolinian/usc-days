import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/lib/metadata";

export const metadata: Metadata = generateMeta({
    title: "Standings - USC Days 2025",
    description:
        "View the latest standings for USC Days 2025 intramural competitions.",
    url: "/standings",
    image: "/tc-logo-red.png",
});

const StandingsPage = () => {
    return <div></div>;
};

export default StandingsPage;
