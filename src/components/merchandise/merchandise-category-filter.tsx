"use client";

import Link, { type LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import LoadError from "@/src/components/merchandise/load-error";
import { getCategoriesQuery } from "@/src/queries/categories.queries";

function FilterOption({
  href,
  label,
  isActive,
}: {
  href: LinkProps["href"];
  label: string;
  isActive: boolean;
}) {
  return (
    <div className="w-full pr-4">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className="inline-flex items-center gap-3 text-sm font-medium text-neutral-900 hover:opacity-70"
      >
        <span className="flex size-[13.52px] shrink-0 items-center justify-center rounded-full border border-neutral-900">
          {isActive && <span className="size-[7.68px] rounded-full bg-neutral-900" />}
        </span>
        {label}
      </Link>
    </div>
  );
}

export default function MerchandiseCategoryFilter() {
  const activeCategory = useSearchParams().get("category")?.toLowerCase();
  const { data: categories, isLoading, error, refetch, isFetching } = getCategoriesQuery();

  return (
    <aside className="flex w-full flex-col items-start gap-5 bg-[#f7f6f6] p-6 font-[family-name:var(--font-roboto-condensed)]">
      <div className="w-full border-b border-neutral-500 py-2.5">
        <h2 className="text-2xl font-semibold text-neutral-900">CATEGORIES</h2>
      </div>

      <FilterOption href={"/merchandise"} label="All" isActive={!activeCategory} />

      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex w-full animate-pulse items-center gap-3">
            <div className="size-[13.52px] rounded-full bg-neutral-300" />
            <div className="h-3.5 w-24 rounded bg-neutral-300" />
          </div>
        ))}

      {error && (
        <LoadError
          title="Couldn't load categories"
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      )}

      {categories?.map((category) => (
        <FilterOption
          key={category.id}
          href={{ pathname: "/merchandise", query: { category: category.categoryName } }}
          label={category.categoryName}
          isActive={activeCategory === category.categoryName.toLowerCase()}
        />
      ))}
    </aside>
  );
}
