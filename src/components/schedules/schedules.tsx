"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, format, isValid, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGamesQuery } from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { sportIcons, sportIconAliases } from "@/src/constants/sportIcons";
import { getMatchdayGameStatus } from "@/src/lib/todays-games";
import { cn } from "@/src/lib/utils";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import { Button } from "@/src/components/ui/button";
import type { Schedules } from "@/src/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import GameDetailsDialog from "./game-details-dialog";
import EditScheduleDialog from "./edit-schedule-dialog";
import AddScoreDialog from "./add-score-dialog";
import ScheduleMatch from "./schedule-match";
import ScheduleNews from "./schedule-news";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit",
});
function scheduleDay(date: Date) { return dayFormatter.format(date); }
function eventName(name: string) {
  if (/3x3/i.test(name)) return "3x3 Basketball";
  if (/mobile legends/i.test(name)) return "Mobile Legends";
  if (/valorant/i.test(name)) return "Valorant";
  if (/swim|freestyle|backstroke|butterfly|breaststroke|medley/i.test(name)) return "Swimming";
  const known = Object.keys(sportIcons).filter(key => key !== "Default").sort((a, b) => b.length - a.length);
  return known.find(key => name.toLowerCase().includes(key.toLowerCase())) ?? sportIconAliases[name] ?? name;
}
function eventGroup(name: string) {
  if (/basketball|volleyball/i.test(name)) return "Court";
  if (/soccer|football|futsal|frisbee/i.test(name)) return "Field";
  if (/pickleball|badminton|tennis/i.test(name)) return "Racket";
  if (/chess|esports|e-sports|mobile legends|valorant/i.test(name)) return "Esports";
  if (/swim/i.test(name)) return "Aquatics";
  return "Other Events";
}

export default function SchedulesPage() {
  const params = useSearchParams();
  const router = useRouter();
  const gamesQuery = useGamesQuery();
  const sportsQuery = getGameTypesQuery();
  const { hasAccess } = useHasHeraldDomainAccess();
  const [now, setNow] = useState<Date | null>(null);
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editGame, setEditGame] = useState<Schedules | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  useEffect(() => {
    const initial = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => { clearTimeout(initial); clearInterval(timer); };
  }, []);
  const sportId = Number(params.get("sport")) || null;
  const selectedEvent = params.get("event");
  const teamId = Number(params.get("team")) || null;
  const rawDate = params.get("date");
  const dateIsValid = !!rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && isValid(parseISO(rawDate)) && format(parseISO(rawDate), "yyyy-MM-dd") === rawDate;
  const today = now ? scheduleDay(now) : null;
  const selectedDay = dateIsValid ? rawDate : today;
  const anchor = selectedDay ? parseISO(selectedDay) : null;
  function updateFilter(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (key === "event") next.delete("sport");
    if (value) next.set(key, value); else next.delete(key);
    router.push(`/schedules${next.size ? `?${next}` : ""}`, { scroll: false });
  }
  const groups = useMemo(() => {
    const result = new Map<string, Schedules[]>();
    for (const game of gamesQuery.data ?? []) {
      if (sportId && game.gameType.id !== sportId) continue;
      if (selectedEvent && eventName(game.gameType.gameName) !== selectedEvent) continue;
      if (teamId && game.teamA?.id !== teamId && game.teamB?.id !== teamId) continue;
      const start = new Date(game.startDate);
      if (!isValid(start)) continue;
      const day = scheduleDay(start);
      if (dateIsValid && day !== rawDate) continue;
      const dayGames = result.get(day) ?? [];
      dayGames.push(game);
      result.set(day, dayGames);
    }
    for (const games of result.values()) games.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate) || a.id - b.id);
    return [...result].sort(([a], [b]) => {
      if (!today) return a.localeCompare(b);
      if (a === today) return -1;
      if (b === today) return 1;
      if ((a >= today) !== (b >= today)) return a >= today ? -1 : 1;
      return a >= today ? a.localeCompare(b) : b.localeCompare(a);
    });
  }, [gamesQuery.data, sportId, selectedEvent, teamId, dateIsValid, rawDate, today]);
  const liveSports = new Set((gamesQuery.data ?? []).filter(game => now && getMatchdayGameStatus(game, now) === "ONGOING").map(game => game.gameType.id));
  const events = [...new Set((sportsQuery.data ?? []).map(sport => eventName(sport.gameName)))];
  const sportGroups = ["Court", "Field", "Racket", "Esports", "Aquatics", "Other Events"].map(name => ({ name, sports: events.filter(event => eventGroup(event) === name) })).filter(group => group.sports.length);
  const loading = gamesQuery.isPending || !now;
  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#f7f6f6] text-[#171717]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[url('/schedules/background.png')] bg-[length:1440px_auto] bg-top bg-repeat opacity-50" />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-6 p-4 sm:p-8 xl:grid-cols-[minmax(200px,1fr)_minmax(0,2.75fr)_minmax(200px,1fr)] xl:p-12">
        <aside aria-label="Filter by event" className="min-w-0 xl:sticky xl:top-20">
          <h2 className="border-b border-neutral-400 py-2.5 text-[32px] font-bold">EVENTS</h2>
          <label htmlFor="schedule-event" className="sr-only">Filter schedules by event</label>
          <select id="schedule-event" value={selectedEvent ?? eventName((sportsQuery.data ?? []).find(sport => sport.id === sportId)?.gameName ?? "")} onChange={e => updateFilter("event", e.target.value || null)} className="mt-3 h-12 w-full rounded border border-neutral-300 bg-[#f7f6f6] px-3 text-base focus-visible:outline-2 focus-visible:outline-tc_primary-400 xl:hidden">
            <option value="">All Events</option>
            {sportGroups.map(group => <optgroup key={group.name} label={group.name}>{group.sports.map(event => <option key={event} value={event}>{event}</option>)}</optgroup>)}
          </select>
          <Button variant="ghost" aria-pressed={!sportId && !selectedEvent} onClick={() => updateFilter("event", null)} className={cn("my-3 hidden h-11 w-full justify-start rounded-none px-2 text-base xl:flex", !sportId && !selectedEvent && "bg-white/70 font-bold")}>
            <Image src={sportIcons.Basketball} width={26} height={26} alt="" />All Events
          </Button>
          {sportsQuery.isPending && <p role="status" className="py-3 text-sm text-neutral-500">Loading events…</p>}
          <div className="hidden flex-col gap-6 pb-3 xl:flex">
            {sportGroups.map(group => <div key={group.name} className="shrink-0 xl:w-full">
              <h3 className="mb-2 text-base text-neutral-500">{group.name}</h3>
              <div className="space-y-1">{group.sports.map(event => {
                const selected = selectedEvent === event || (!selectedEvent && (sportsQuery.data ?? []).some(sport => sport.id === sportId && eventName(sport.gameName) === event));
                const live = (sportsQuery.data ?? []).some(sport => eventName(sport.gameName) === event && liveSports.has(sport.id));
                return <Button key={event} variant="ghost" aria-pressed={selected} onClick={() => updateFilter("event", event)} className={cn("flex min-h-11 h-auto w-full justify-start rounded-none px-2 py-2 text-[15px] whitespace-normal", selected && "bg-white/80 font-bold ring-1 ring-neutral-300")}>
                  <Image src={sportIcons[sportIconAliases[event] ?? event] ?? (/mobile legends|valorant/i.test(event) ? sportIcons.Esports : sportIcons.Default)} width={26} height={26} alt="" className="shrink-0 object-contain" />
                  <span className="min-w-0 text-left">{event}</span>
                  {live && <span className="ml-auto bg-tc_primary-400 px-2 py-0.5 text-xs text-white">Live</span>}
                </Button>;
              })}</div>
            </div>)}
          </div>
          {sportsQuery.isError && <div role="alert" className="text-sm">Events could not be loaded. <Button variant="link" onClick={() => void sportsQuery.refetch()}>Retry</Button></div>}
        </aside>
        <section aria-label="Game schedules" className="min-w-0 space-y-6">
          <h1 className="sr-only">USC Days game schedules</h1>
          <nav aria-label="Schedule dates" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#f7f6f6] px-2 sm:gap-5">
            <Button variant="ghost" size="icon" disabled={!anchor} aria-label="Previous day" onClick={() => anchor && updateFilter("date", format(addDays(anchor, -1), "yyyy-MM-dd"))}><ArrowLeft /></Button>
            <span className="text-sm text-neutral-500">{anchor ? format(addDays(anchor, -1), "MMM d") : "—"}</span>
            <Button variant="ghost" aria-label="Show today and all schedules" onClick={() => updateFilter("date", null)} className="h-12 px-3 text-2xl font-bold">{selectedDay === today ? "Today" : anchor ? format(anchor, "MMM d") : "Today"}</Button>
            <span className="text-sm text-neutral-500">{anchor ? format(addDays(anchor, 1), "MMM d") : "—"}</span>
            <Button variant="ghost" size="icon" disabled={!anchor} aria-label="Next day" onClick={() => anchor && updateFilter("date", format(addDays(anchor, 1), "yyyy-MM-dd"))}><ArrowRight /></Button>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-neutral-500">Select a match to view its details.</p>
            {(sportId || selectedEvent || dateIsValid || teamId) && <Button variant="link" onClick={() => router.push("/schedules", { scroll: false })}>Clear filters</Button>}
            {hasAccess && <AddScheduleDialog />}
          </div>
          {loading ? <div role="status" aria-label="Loading schedules" className="space-y-6">{[0, 1, 2].map(i => <div key={i} className="h-48 rounded-xl bg-white/70 motion-safe:animate-pulse" />)}<span className="sr-only">Loading schedules</span></div> : gamesQuery.isError ? <div role="alert" className="rounded-xl bg-white p-6"><p>Schedules could not be loaded.</p><Button variant="outline" disabled={gamesQuery.isFetching} onClick={() => void gamesQuery.refetch()} className="mt-3">Retry</Button></div> : !groups.length ? <div role="status" className="rounded-xl bg-[#f7f6f6] p-8 text-center"><p className="text-xl font-bold">No matches scheduled{anchor && dateIsValid ? ` for ${format(anchor, "MMMM d")}` : ""}.</p><p className="mt-2 text-neutral-500">Choose another date or event to see more matches.</p></div> : groups.map(([day, games]) => <section key={day} aria-label={`Matches for ${day}`} className="space-y-3 rounded-xl bg-[#f7f6f6] p-4 sm:px-5 sm:py-6">
            <h2 className="text-xl font-bold">{day === today ? "Today" : format(parseISO(day), "MMM d, yyyy").toUpperCase()}</h2>
            {games.map(game => <ScheduleMatch key={game.id} game={game} now={now!} featured={getMatchdayGameStatus(game, now!) === "ONGOING"} onOpen={() => { setSelectedGame(game); setDetailsOpen(true); }} />)}
          </section>)}
        </section>
        <ScheduleNews />
      </div>
      <GameDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} game={selectedGame} onEditSchedule={game => { setEditGame(game); setDetailsOpen(false); }} onAddScore={game => { setSelectedGame(game); setDetailsOpen(false); setScoreOpen(true); }} />
      {editGame && <EditScheduleDialog schedule={editGame} open onOpenChange={open => { if (!open) setEditGame(null); }} />}
      <AddScoreDialog open={scoreOpen} onOpenChange={setScoreOpen} game={selectedGame} />
    </div>
  );
}
