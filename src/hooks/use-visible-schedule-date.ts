"use client";

import { useEffect, useState } from "react";
import type { ScheduleDay } from "@/src/lib/schedules";

/** Follow the day whose section has reached the space below the sticky bar. */
export function useVisibleScheduleDate(days: readonly ScheduleDay[], isLoading: boolean) {
  const [visibleDate, setVisibleDate] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const sections = days.flatMap(day => {
      const element = document.getElementById(`schedule-day-${day.date}`);
      return element ? [{ date: day.date, element }] : [];
    });
    if (!sections.length) return;

    let frame: number | null = null;

    function updateVisibleDate() {
      frame = null;
      const navigation = document.getElementById("schedule-date-navigation");
      const boundary = Math.max(
        navigation?.getBoundingClientRect().bottom ?? 0,
        parseFloat(getComputedStyle(sections[0].element).scrollMarginTop),
      );
      let current = sections[0].date;

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top > boundary + 1) break;
        current = section.date;
      }
      setVisibleDate(current);
    }

    function scheduleUpdate() {
      if (frame === null) frame = requestAnimationFrame(updateVisibleDate);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [days, isLoading]);

  return visibleDate;
}
