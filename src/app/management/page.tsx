import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/lib/metadata";
import Management from "@/components/management/management";

export const metadata: Metadata = generateMeta({
    title: "Management Dashboard - USC Days 2025",
    description:
        "Administrative dashboard for managing USC Days 2025 teams, sports, and competition data.",
    url: "/management",
    image: "/tc-logo-red.png",
});

const ManagementPage = () => {
    return (
        <div>
            <Management />
        </div>
    );
};

export default ManagementPage;
