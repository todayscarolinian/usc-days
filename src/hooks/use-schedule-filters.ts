"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseScheduleDate, parseScheduleId } from "@/src/lib/schedules";

type FilterKey = "event" | "date" | "team";

export function useScheduleFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const filters = useMemo(() => ({
    event: params.get("event") || null,
    sportId: parseScheduleId(params.get("sport")),
    teamId: parseScheduleId(params.get("team")),
    date: parseScheduleDate(params.get("date")),
  }), [params]);

  function navigate(next: URLSearchParams) {
    startTransition(() => {
      router.push(`/schedules${next.size ? `?${next}` : ""}`, { scroll: false });
    });
  }

  function setFilter(key: FilterKey, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (key === "event") {
      next.delete("sport");
      next.delete("date");
    }
    if (value) next.set(key, value);
    else next.delete(key);
    navigate(next);
  }

  return {
    filters,
    setFilter,
    isNavigating,
  };
}
