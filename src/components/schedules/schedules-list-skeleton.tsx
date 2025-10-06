"use client";

import { useEffect, useRef } from "react";
import SchedulesCardSkeleton from "./schedules-card-skeleton";

type Props = {
  days?: number
  rowsPerDay?: number
}

export default function SchedulesListSkeleton({ days = 1, rowsPerDay = 2 }: Props) {
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
      {Array.from({ length: days }).map((_, i) => (
        <SchedulesCardSkeleton key={i} rows={rowsPerDay} />
      ))}
      <div ref={loadMoreRef} className="h-10 w-full" />
    </div>
  )
}