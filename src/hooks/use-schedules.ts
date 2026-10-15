"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useGamesQuery } from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import {
  buildScheduleEvents,
  getScheduleDay,
  getScheduleEventName,
  groupScheduleGames,
} from "@/src/lib/schedules";
import { useScheduleFilters } from "./use-schedule-filters";
import { useVisibleScheduleDate } from "./use-visible-schedule-date";
import { useScheduleScrollTarget } from "./use-schedule-scroll-target";

function scrollToScheduleDate(date: string) {
  const target = document.getElementById(`schedule-day-${date}`);
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
}

export function useSchedules() {
  const navigation = useScheduleFilters();
  const [isSwitchingEvent, startEventTransition] = useTransition();
  const { requestedDate, setRequestedDate } = useScheduleScrollTarget();
  const games = useGamesQuery(undefined, { refetchInterval: 60_000 });
  const sports = getGameTypesQuery();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = setTimeout(() => setNow(new Date()), 0);
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const today = now ? getScheduleDay(now) : null;
  const isLoading = games.isPending || !now;
  const days = useMemo(
    () => groupScheduleGames(
      games.data ?? [],
      { ...navigation.filters, date: null },
      today,
      navigation.filters.date ?? today,
    ),
    [games.data, navigation.filters, today],
  );
  const eventGroups = useMemo(
    () => buildScheduleEvents(sports.data ?? [], games.data ?? [], now),
    [sports.data, games.data, now],
  );
  const visibleDate = useVisibleScheduleDate(days, isLoading);
  const selectedSport = sports.data?.find(sport => sport.id === navigation.filters.sportId);
  const selectedEvent = navigation.filters.event ??
    (selectedSport ? getScheduleEventName(selectedSport.gameName) : null);

  useEffect(() => {
    if (isLoading || !navigation.filters.date) return;
    const date = navigation.filters.date;
    const frame = requestAnimationFrame(() => scrollToScheduleDate(date));
    return () => cancelAnimationFrame(frame);
  }, [isLoading, navigation.filters.date]);

  function selectEvent(event: string | null) {
    setRequestedDate(null);
    startEventTransition(() => navigation.setFilter("event", event));
    // Each tab starts fresh; cancel any in-progress jump from the previous sport.
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function navigateToDate(date: string) {
    setRequestedDate(date);
    if (date === navigation.filters.date) scrollToScheduleDate(date);
    else navigation.setFilter("date", date);
  }

  return {
    ...navigation,
    games,
    sports,
    now,
    today,
    days,
    eventGroups,
    selectedEvent,
    isLoading,
    navigateToDate,
    selectEvent,
    isSwitchingEvent,
    visibleDate,
    navigationDate: requestedDate ?? visibleDate ?? navigation.filters.date,
  };
}
