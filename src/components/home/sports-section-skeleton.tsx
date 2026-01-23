import { Skeleton } from "@/src/components/ui/skeleton";

export default function SportsSectionSkeleton() {
  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold mb-8">Sports</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 md:gap-12 w-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <figure key={i} className="flex flex-col items-center text-center">
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full" />
            <Skeleton className="mt-2 h-3 max-w-[100px]" />
          </figure>
        ))}
      </div>
    </div>
  );
}