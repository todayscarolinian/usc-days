import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";

export const metadata: Metadata = generateMeta({
  title: "Management Dashboard - USC Days 2025",
  description:
    "Administrative dashboard for managing USC Days 2025 teams, sports, and competition data.",
  url: "/management",
  image: "/og_image.jpg",
});

const ManagementPage = () => {
  return <div></div>;
};

export default ManagementPage;
