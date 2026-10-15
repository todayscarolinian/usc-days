import { Metadata } from "next";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import CategoryProductsClient from "@/src/components/merchandise/category-products";
import CategoryService from "@/src/services/category.service";

const categoryService = new CategoryService();

export const metadata: Metadata = generateMeta({
  title: "Merchandise Category - USC Days 2025",
  description:
    "Browse merchandise by category for USC Days 2025. Find apparel, accessories, and more to show your school spirit.",
  url: "/merchandise/[categoryName]",
  image: "/og_image.jpg",
});

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) {
  const { categoryName } = await params;

  let categories;
  let error;

  try {
    categories = await categoryService.getCategories();
  } catch (err) {
    error = err;
  }

  if (error) {
    return (
      <div className="p-12">
        <h2 className="text-3xl font-bold mb-4">Error loading category</h2>
        <p className="text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load merchandise category"}
        </p>
      </div>
    );
  }

  const category = categories?.find(
    (c) => c.categoryName.toLowerCase() === categoryName.toLowerCase(),
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
      <CategoryProductsClient
        categoryId={category.id}
        categoryName={category.categoryName}
      />
    </div>
  );
}
