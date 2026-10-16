"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseScheduleDate, parseScheduleId } from "@/src/lib/schedules";

type FilterKey = "event" | "date" | "team";

export function useScheduleFilters() {
  const params = useSearchParams();
  const filters = useMemo(() => ({
    event: params.get("event") || null,
    sportId: parseScheduleId(params.get("sport")),
    teamId: parseScheduleId(params.get("team")),
    date: parseScheduleDate(params.get("date")),
  }), [params]);

  function navigate(next: URLSearchParams) {
    // These filters use data already on the client. Update the current URL
    // without a server navigation that briefly disables and dims the controls.
    window.history.replaceState(null, "", `/schedules${next.size ? `?${next}` : ""}`);
  }

  function setFilter(key: FilterKey, value: string | null) {
    const next = new URLSearchParams(params.toString());
    next.delete("match");
    next.delete("preview");
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
    isNavigating: false,
  };
}
