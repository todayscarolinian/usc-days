import { Skeleton } from "@/src/components/ui/skeleton";

export default function MerchSectionSkeleton() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}