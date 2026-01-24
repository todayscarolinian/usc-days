import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import CategoryProductsClient from "@/src/components/merchandise/category-products";
import CATEGORIES from "@/src/constants/categories.json";

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId: categoryIdStr } = await params;
  const categoryId = parseInt(categoryIdStr);
  
  const category = CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold">Category not found</h2>
      </div>
    );
  }

  return (
    <div>
      <CategoryProductsClient categoryId={categoryId} categoryName={category.name} />
    </div>
  );
}