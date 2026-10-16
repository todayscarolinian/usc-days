"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import LoadError from "@/src/components/merchandise/load-error";
import MerchandiseCategoryFilter from "@/src/components/merchandise/merchandise-category-filter";
import MerchandiseModal from "@/src/components/merchandise/merchandise-modal";
import ProductCard from "@/src/components/merchandise/product-card";
import { getCategoriesQuery } from "@/src/queries/categories.queries";
import {
  useGetInfiniteProductsQuery,
  useGetProductsQuery,
} from "@/src/queries/product.queries";
import type {
  MerchandiseCategory,
  MerchandiseProduct,
} from "@/src/lib/prisma/generated/client";

type Product = ComponentProps<typeof MerchandiseModal>["product"];

const PREVIEW_SIZE = 6;
const PAGE_SIZE = 12;

const headingClassName =
  "font-[family-name:var(--font-roboto-condensed)] text-2xl font-semibold text-neutral-900";

function ProductGrid({
  products,
  onSelect,
}: {
  products: MerchandiseProduct[];
  onSelect: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.productTitle}
          price={Number(product.productPrice)}
          imgUrl={(product.imgUrls as string[])[0]}
          isAvailable={product.isAvailable}
          onClick={() => onSelect(product as Product)}
        />
      ))}
    </div>
  );
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-3 rounded-xl bg-[#f7f6f6] p-4">
          <div className="h-6 w-2/3 rounded bg-neutral-300" />
          <div className="h-[223px] w-full rounded bg-neutral-200" />
          <div className="flex justify-between">
            <div className="h-5 w-20 rounded bg-neutral-300" />
            <div className="h-5 w-24 rounded bg-neutral-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryPreview({
  category,
  onSelect,
}: {
  category: MerchandiseCategory;
  onSelect: (product: Product) => void;
}) {
  const { data: products, isLoading, error, refetch, isFetching } = useGetProductsQuery({
    categoryId: category.id,
    page: 1,
    pageSize: PREVIEW_SIZE,
  });

  if (!isLoading && !error && !products?.length) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className={headingClassName}>{category.categoryName}</h2>
        {!!products?.length && (
          <Link
            href={{ pathname: "/merchandise", query: { category: category.categoryName } }}
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      {isLoading && <ProductGridSkeleton count={3} />}
      {error && (
        <LoadError
          title={`Couldn't load ${category.categoryName.toLowerCase()}`}
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      )}
      {products && <ProductGrid products={products} onSelect={onSelect} />}
    </div>
  );
}

function CategoryProducts({
  category,
  onSelect,
}: {
  category: MerchandiseCategory;
  onSelect: (product: Product) => void;
}) {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetInfiniteProductsQuery({ categoryId: category.id, pageSize: PAGE_SIZE });

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const total = data?.pages[0]?.total;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className={headingClassName}>{category.categoryName}</h2>
        {total !== undefined && total > 0 && (
          <p className="text-sm text-neutral-600">
            Showing {products.length} of {total}
          </p>
        )}
      </div>

      {isLoading && <ProductGridSkeleton count={6} />}
      {error && (
        <LoadError
          title={`Couldn't load ${category.categoryName.toLowerCase()}`}
          isRetrying={isRefetching || isFetchingNextPage}
          onRetry={() => void (products.length ? fetchNextPage() : refetch())}
        />
      )}
      {!isLoading && !error && products.length === 0 && (
        <p className="text-neutral-600">No products found in this category.</p>
      )}
      {products.length > 0 && <ProductGrid products={products} onSelect={onSelect} />}

      {hasNextPage && !error && (
        <Button
          type="button"
          variant="outline"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
          className="self-center"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}

export default function MerchandiseSection() {
  const activeCategory = useSearchParams().get("category")?.toLowerCase();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: categories, isLoading, error, refetch, isFetching } = getCategoriesQuery();

  const category = activeCategory
    ? categories?.find((c) => c.categoryName.toLowerCase() === activeCategory)
    : undefined;

  return (
    <section className="relative flex flex-col items-start gap-6 p-6 lg:flex-row lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/white-bg.png')] bg-top bg-repeat opacity-50"
      />

      <div className="relative w-full shrink-0 lg:sticky lg:top-20 lg:w-[358px]">
        <MerchandiseCategoryFilter />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col gap-12">
        {isLoading && <ProductGridSkeleton count={6} />}

        {error && (
          <LoadError
            title="Couldn't load merchandise"
            isRetrying={isFetching}
            onRetry={() => void refetch()}
          />
        )}

        {categories && !activeCategory &&
          categories.map((c) => (
            <CategoryPreview key={c.id} category={c} onSelect={setSelectedProduct} />
          ))}

        {categories && activeCategory && category && (
          <CategoryProducts key={category.id} category={category} onSelect={setSelectedProduct} />
        )}

        {categories && activeCategory && !category && (
          <p className="text-neutral-600">
            Category not found.{" "}
            <Link href="/merchandise" className="font-medium text-neutral-900 underline">
              View all merchandise
            </Link>
          </p>
        )}
      </div>

      {selectedProduct && (
        <MerchandiseModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
