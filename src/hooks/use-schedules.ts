"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createMockTodaysGames } from "@/src/components/home/todays-games.mock";
import { useSearchParams } from "next/navigation";
import { useGamesQuery, useScheduleWindow } from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import {
  buildScheduleEvents,
  getScheduleDay,
  getScheduleEventName,
  getScheduleGameTypeIds,
  groupScheduleGames,
  isScheduleDateLoaded,
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
  const params = useSearchParams();
  const matchId = /^-?[1-9]\d*$/.test(params.get("match") ?? "") ? params.get("match") : null;
  const previewTime = Date.parse(params.get("preview") ?? "");
  const isPreview = Number.isFinite(previewTime);
  const navigation = useScheduleFilters();
  const { filters } = navigation;
  const { requestedDate, setRequestedDate } = useScheduleScrollTarget();
  const sports = getGameTypesQuery();
  const [now, setNow] = useState<Date | null>(null);
  // The day the loaded games are centred on. `null` follows today.
  const [anchorDate, setAnchorDate] = useState<string | null>(filters.date);

  useEffect(() => {
    const initial = setTimeout(() => setNow(new Date()), 0);
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const today = now ? getScheduleDay(now) : null;
  const windowAnchor = anchorDate ?? today;
  // Wait for the sports list before filtering by event or sport.
  const gameTypeIds = sports.data
    ? getScheduleGameTypeIds(sports.data, filters)
    : filters.event || filters.sportId ? undefined : null;
  const liveGames = useScheduleWindow({ anchor: windowAnchor, gameTypeIds, teamId: filters.teamId });
  const previewGames = useMemo(
    () => isPreview ? createMockTodaysGames(new Date(previewTime)) : [],
    [isPreview, previewTime],
  );
  const games = isPreview ? {
    ...liveGames, games: previewGames,
    isPending: false, isError: false, isFetching: false,
    hasOlder: false, hasNewer: false, isLoadingOlder: false, isLoadingNewer: false,
  } : liveGames;
  // Live markers cover every event, not just the filtered window.
  const todayGames = useGamesQuery(
    today ? { startDate: today, endDate: today } : undefined,
    { refetchInterval: 60_000, enabled: today !== null },
  );

  const isLoading = games.isPending || !now;
  const days = useMemo(
    () => groupScheduleGames(games.games, { ...filters, date: null }, filters.date ?? windowAnchor),
    [games.games, filters, windowAnchor],
  );
  const eventGroups = useMemo(
    () => buildScheduleEvents(sports.data ?? [], todayGames.data ?? [], now),
    [sports.data, todayGames.data, now],
  );
  const visibleDate = useVisibleScheduleDate(days, isLoading);
  const selectedSport = sports.data?.find(sport => sport.id === filters.sportId);
  const selectedEvent = filters.event ??
    (selectedSport ? getScheduleEventName(selectedSport.gameName) : null);

  // Scroll to the anchor once per window, and again whenever the URL date changes.
  const scrollTarget = filters.date ?? windowAnchor;
  const scrollKey = `${windowAnchor}|${filters.event}|${filters.sportId}|${filters.teamId}|${scrollTarget}`;
  const scrolledKey = useRef<string | null>(null);
  useEffect(() => {
    if (isLoading || !scrollTarget || scrolledKey.current === `${scrollKey}|${matchId}`) return;
    const frame = requestAnimationFrame(() => {
      const target = matchId ? document.getElementById(`schedule-match-${matchId}`) : null;
      scrolledKey.current = `${scrollKey}|${matchId}`;
      if (target) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Offset the center to account for the fixed 64px navigation bar.
        const top = target.getBoundingClientRect().top + window.scrollY -
          (window.innerHeight + 64 - target.getBoundingClientRect().height) / 2;
        target.focus({ preventScroll: true });
        window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "instant" : "smooth" });
      } else scrollToScheduleDate(scrollTarget);
    });
    return () => cancelAnimationFrame(frame);
  }, [isLoading, scrollTarget, scrollKey, matchId]);

  function selectEvent(event: string | null) {
    setRequestedDate(null);
    setAnchorDate(null);
    navigation.setFilter("event", event);
    // Each tab starts fresh; cancel any in-progress jump from the previous sport.
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function navigateToDate(date: string) {
    setRequestedDate(date);
    if (games.loadedRange && !isScheduleDateLoaded(games.loadedRange, date)) {
      setAnchorDate(date);
    }
    if (date === filters.date) scrollToScheduleDate(date);
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
    visibleDate,
    navigationDate: requestedDate ?? visibleDate ?? filters.date,
  };
}
