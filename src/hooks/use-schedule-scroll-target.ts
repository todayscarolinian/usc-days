"use client";

import { useEffect, useState } from "react";

/** Keep the selected date visible while its smooth scroll is in progress. */
export function useScheduleScrollTarget() {
  const [requestedDate, setRequestedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!requestedDate) return;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    function finish() {
      clearTimeout(idleTimer);
      setRequestedDate(null);
    }

    // Fallback for browsers without scrollend support.
    function handleScroll() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(finish, 140);
    }

    function handleKey(event: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) finish();
    }

    function handlePointer(event: PointerEvent) {
      if (event.target instanceof Element && event.target.closest("#schedule-date-navigation")) return;
      finish();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", finish);
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("touchmove", finish, { passive: true });
    window.addEventListener("pointerdown", handlePointer);
    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", finish);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchmove", finish);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [requestedDate]);

  return { requestedDate, setRequestedDate };
}
