"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  completeScheduleAutoScrollRequest,
  getPendingScheduleAutoScrollRequest,
  isScheduleAutoScrollScopeReady,
  requestEventScheduleAutoScroll,
  selectScheduleAutoScrollTarget,
  subscribeToScheduleAutoScrollRequests,
  type ScheduleAutoScrollRequest,
} from "@/src/lib/schedule-auto-scroll";
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
  const navigation = useScheduleFilters();
  const { filters } = navigation;
  const { requestedDate, setRequestedDate } = useScheduleScrollTarget();
  const sports = getGameTypesQuery();
  const [now, setNow] = useState<Date | null>(null);
  const [autoScrollRequest, setAutoScrollRequest] = useState<ScheduleAutoScrollRequest | null>(null);
  const completedAutoScrollRequest = useRef<number | null>(null);
  const attemptedFuturePage = useRef<string | null>(null);
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

  useEffect(() => {
    function handleRequest(request: ScheduleAutoScrollRequest) {
      completedAutoScrollRequest.current = null;
      attemptedFuturePage.current = null;
      if (request.source === "full-schedule") {
        setRequestedDate(null);
        setAnchorDate(null);
      }
      setAutoScrollRequest(request);
    }

    const pending = getPendingScheduleAutoScrollRequest();
    if (pending) handleRequest(pending);
    return subscribeToScheduleAutoScrollRequests(handleRequest);
  }, [setRequestedDate]);

  const today = now ? getScheduleDay(now) : null;
  const windowAnchor = anchorDate ?? today;
  // Wait for the sports list before filtering by event or sport.
  const gameTypeIds = sports.data
    ? getScheduleGameTypeIds(sports.data, filters)
    : filters.event || filters.sportId ? undefined : null;
  const games = useScheduleWindow({ anchor: windowAnchor, gameTypeIds, teamId: filters.teamId });
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

  // Preserve explicit date/match deep links, but do not scroll on an ordinary
  // direct visit. Click-triggered automatic targeting is handled separately.
  const deepLinkScrollTarget = filters.date ?? (matchId ? windowAnchor : null);
  const deepLinkScrollKey = `${windowAnchor}|${filters.event}|${filters.sportId}|${filters.teamId}|${deepLinkScrollTarget}`;
  const scrolledKey = useRef<string | null>(null);
  useEffect(() => {
    if ((autoScrollRequest && completedAutoScrollRequest.current !== autoScrollRequest.id) ||
      isLoading || !deepLinkScrollTarget || scrolledKey.current === `${deepLinkScrollKey}|${matchId}`) return;
    const frame = requestAnimationFrame(() => {
      const target = matchId ? document.getElementById(`schedule-match-${matchId}`) : null;
      scrolledKey.current = `${deepLinkScrollKey}|${matchId}`;
      if (target) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Keep the established match deep-link positioning.
        const top = target.getBoundingClientRect().top + window.scrollY -
          (window.innerHeight + 64 - target.getBoundingClientRect().height) / 2;
        target.focus({ preventScroll: true });
        window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "instant" : "smooth" });
      } else scrollToScheduleDate(deepLinkScrollTarget);
    });
    return () => cancelAnimationFrame(frame);
  }, [autoScrollRequest, isLoading, deepLinkScrollTarget, deepLinkScrollKey, matchId]);

  useEffect(() => {
    if (!autoScrollRequest || completedAutoScrollRequest.current === autoScrollRequest.id ||
      !now || isLoading || !isScheduleAutoScrollScopeReady(autoScrollRequest, filters, matchId)) return;

    const request = autoScrollRequest;
    const game = selectScheduleAutoScrollTarget(days, now, selectedEvent === "Swimming");
    if (!game) {
      if (games.isLoadingNewer) return;
      if (games.hasNewer) {
        const pageKey = `${request.id}|${games.futurePageCount}`;
        if (attemptedFuturePage.current !== pageKey) {
          attemptedFuturePage.current = pageKey;
          void games.loadNewer();
          return;
        }
      }
      completedAutoScrollRequest.current = request.id;
      completeScheduleAutoScrollRequest(request.id);
      return;
    }

    const targetGame = game;
    let frame = 0;
    function scrollWhenUnlocked() {
      if (document.body.hasAttribute("data-scroll-locked")) {
        frame = requestAnimationFrame(scrollWhenUnlocked);
        return;
      }

      const target = document.getElementById(`schedule-match-${targetGame.id}`);
      if (!target) return;
      const day = target.closest<HTMLElement>(`[id^="schedule-day-"]`);
      const scrollMargin = day ? Number.parseFloat(getComputedStyle(day).scrollMarginTop) : Number.NaN;
      const offset = Number.isFinite(scrollMargin) ? scrollMargin : 80;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      target.focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "instant" : "smooth" });
      completedAutoScrollRequest.current = request.id;
      completeScheduleAutoScrollRequest(request.id);
    }

    frame = requestAnimationFrame(scrollWhenUnlocked);
    return () => cancelAnimationFrame(frame);
  }, [autoScrollRequest, days, filters, games, isLoading, matchId, now, selectedEvent]);

  function selectEvent(event: string | null) {
    setRequestedDate(null);
    setAnchorDate(null);
    navigation.setFilter("event", event);
    requestEventScheduleAutoScroll(event);
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
