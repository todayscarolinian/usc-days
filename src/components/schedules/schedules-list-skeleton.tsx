"use client";

import { useEffect, useRef } from "react";
import SchedulesCardSkeleton from "./schedules-card-skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { format } from "date-fns";

type Props = {
  days?: number;
  rowsPerDay?: number;
  error?: string | null;
};

export default function SchedulesListSkeleton({
  days = 1,
  rowsPerDay = 2,
  error = null,
}: Props) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = loadMoreRef.current;
    if (!current) return;
    const observer = new IntersectionObserver(() => {}, { threshold: 1.0 });
    observer.observe(current);
    return () => observer.unobserve(current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-15 w-full">
      {error ? (
        <Card className="w-full py-4">
          <CardHeader className="flex flex-row md:flex-col">
            <CardTitle className="flex-1 text-lg md:text-2xl">
              {format(new Date(), "MMM d, yyyy").toUpperCase()}
            </CardTitle>
            <p className="flex-1 text-right text-xs text-gray-500">
              {format(new Date(), "EEEE").toUpperCase()}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-red-600 text-sm text-center mb-6">{error}</p>
          </CardContent>
        </Card>
      ) : (
        Array.from({ length: days }).map((_, i) => (
          <SchedulesCardSkeleton key={i} rows={rowsPerDay} />
        ))
      )}
      <div ref={loadMoreRef} className="h-10 w-full" />
    </div>
  );
}
