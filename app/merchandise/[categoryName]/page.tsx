import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import CategoryProductsClient from "@/src/components/merchandise/category-products";
import CATEGORIES from "@/src/constants/categories.json";

export const metadata: Metadata = generateMeta({
  title: "Merchandise Category - USC Days 2025",
    description:
    "Browse merchandise by category for USC Days 2025. Find apparel, accessories, and more to show your school spirit.",
  url: "/merchandise/[categoryName]",
  image: "/tc-logo-red.png",
});

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ categoryName: string }> 
}) {
  const { categoryName } = await params;
  
  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold">Category not found</h2>
      </div>
    );
  }

  return (
    <div>
      <CategoryProductsClient categoryId={category.id} categoryName={category.name} />
    </div>
  );
}