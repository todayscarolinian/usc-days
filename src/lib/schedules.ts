import { addDays, format, isValid, parseISO } from "date-fns";
import { getGameStatus } from "@/src/lib/game-status";
import type { Schedules } from "@/src/types/types";

export const SCHEDULE_TIME_ZONE = "Asia/Manila";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SCHEDULE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const scheduleTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

export type ScheduleFilters = {
  event: string | null;
  sportId: number | null;
  teamId: number | null;
  date: string | null;
};

export type ScheduleDay = { date: string; games: Schedules[] };
export type ScheduleEvent = { name: string; isLive: boolean };
export type ScheduleEventGroup = { name: string; events: ScheduleEvent[] };

// Specific names precede broader matches, including historical API names.
const EVENT_DEFINITIONS = [
  { name: "3x3 Basketball", group: "Court", pattern: /3x3/i },
  { name: "Basketball", group: "Court", pattern: /basketball/i },
  { name: "Volleyball", group: "Court", pattern: /volleyball/i },
  { name: "Flag Football", group: "Field", pattern: /flag football/i },
  { name: "Football", group: "Field", pattern: /soccer|football/i },
  { name: "Futsal", group: "Field", pattern: /futsal/i },
  { name: "Frisbee", group: "Field", pattern: /frisbee/i },
  { name: "Pickleball", group: "Racket", pattern: /pickleball/i },
  { name: "Badminton", group: "Racket", pattern: /badminton/i },
  { name: "Lawn Tennis", group: "Racket", pattern: /lawn tennis/i },
  { name: "Table Tennis", group: "Racket", pattern: /table tennis/i },
  { name: "Chess", group: "Board Games", pattern: /chess/i },
  { name: "Mobile Legends", group: "Esports", pattern: /mobile legends/i },
  { name: "Valorant", group: "Esports", pattern: /valorant/i },
  { name: "Esports", group: "Esports", pattern: /e-?sports/i },
  { name: "Swimming", group: "Aquatics", pattern: /swim|freestyle|backstroke|butterfly|breaststroke|medley/i },
  { name: "Cheer Dance", group: "Other Events", pattern: /cheer\s?dance/i },
  { name: "Contemporary Dance", group: "Other Events", pattern: /contemporary dance/i },
  { name: "Mr. & Ms. USC", group: "Other Events", pattern: /mr\.|ms\./i },
] as const;

const EVENT_GROUPS = ["Court", "Field", "Racket", "Esports", "Board Games", "Aquatics", "Other Events"];

/** The team is team A, team B, or one of a multi-team game's entries. */
function playsIn(game: Schedules, teamId: number) {
  return game.teamA?.id === teamId ||
    game.teamB?.id === teamId ||
    (game.participants ?? []).some(entry => entry.teamId === teamId);
}

export function getScheduleEventName(name: string): string {
  return EVENT_DEFINITIONS.find(event => event.pattern.test(name))?.name ?? name;
}

export function groupSwimmingMatches(games: readonly Schedules[]) {
  const categories = new Map<string, Schedules[]>();
  for (const game of games) {
    const name = game.gameType.gameName;
    let category = "Swimming";
    const variation = name.match(/\b(\d+\s*x\s*\d+\s*m?|\d+\s*m)\s+(.+)$/i);
    if (variation) {
      const distance = variation[1].replace(/\s/g, "").toLowerCase().replace(/m?$/, "m");
      const stroke = variation[2].trim().replace(/\b\w+/g, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
      category = `${distance} ${stroke}`;
    }
    const matches = categories.get(category) ?? [];
    matches.push(game);
    categories.set(category, matches);
  }
  return [...categories].map(([name, games]) => ({ name, games }));
}

export function getScheduleDay(date: Date): string {
  return dayFormatter.format(date);
}

export function parseScheduleDate(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = parseISO(value);
  return isValid(date) && format(date, "yyyy-MM-dd") === value ? value : null;
}

export function parseScheduleId(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** Calendar arithmetic on `yyyy-MM-dd` day keys. */
export function addScheduleDays(date: string, days: number): string {
  return format(addDays(parseISO(date), days), "yyyy-MM-dd");
}

/**
 * Sport ids the server should filter by: every sport in the selected event,
 * else the legacy sport id. `null` means no sport filter; an empty array means
 * the event matched no sports, so nothing can be shown.
 */
export function getScheduleGameTypeIds(
  sports: readonly { id: number; gameName: string }[],
  filters: Pick<ScheduleFilters, "event" | "sportId">,
): number[] | null {
  if (filters.event) {
    return sports
      .filter(sport => getScheduleEventName(sport.gameName) === filters.event)
      .map(sport => sport.id);
  }
  return filters.sportId ? [filters.sportId] : null;
}

/**
 * Days whose games are all loaded. A bound is `null` once that side has no more
 * pages. The outermost loaded day of a side with more pages may be partial, so
 * it stays outside the range.
 */
export type ScheduleLoadedRange = { after: string | null; before: string | null };

export function getScheduleLoadedRange(
  anchor: string,
  oldestPastGame: Schedules | undefined,
  newestFutureGame: Schedules | undefined,
  hasOlder: boolean,
  hasNewer: boolean,
): ScheduleLoadedRange {
  const dayOf = (game: Schedules) => getScheduleDay(new Date(game.startDate));
  return {
    after: hasOlder ? (oldestPastGame ? dayOf(oldestPastGame) : addScheduleDays(anchor, -1)) : null,
    before: hasNewer ? (newestFutureGame ? dayOf(newestFutureGame) : addScheduleDays(anchor, 1)) : null,
  };
}

export function isScheduleDateLoaded(range: ScheduleLoadedRange, date: string): boolean {
  return (range.after === null || date > range.after) && (range.before === null || date < range.before);
}

export function buildScheduleEvents(
  sports: readonly { id: number; gameName: string }[],
  games: readonly Schedules[],
  now: Date | null,
): ScheduleEventGroup[] {
  const liveEvents = new Set(
    games
      .filter(game => now && getGameStatus(game, now) === "live")
      .map(game => getScheduleEventName(game.gameType.gameName)),
  );
  const names = new Set(sports.map(sport => getScheduleEventName(sport.gameName)));
  const orderedNames = [
    ...EVENT_DEFINITIONS.map(event => event.name).filter(name => names.has(name)),
    ...[...names].filter(name => !EVENT_DEFINITIONS.some(event => event.name === name)),
  ];

  return EVENT_GROUPS.map(name => ({
    name,
    events: orderedNames
      .filter(event => (EVENT_DEFINITIONS.find(item => item.name === event)?.group ?? "Other Events") === name)
      .map(event => ({ name: event, isLive: liveEvents.has(event) })),
  })).filter(group => group.events.length > 0);
}

export function groupScheduleGames(
  games: readonly Schedules[],
  filters: ScheduleFilters,
  anchorDate?: string | null,
): ScheduleDay[] {
  const groups = new Map<string, Schedules[]>();

  for (const game of games) {
    if (filters.event && getScheduleEventName(game.gameType.gameName) !== filters.event) continue;
    // A named event supersedes a legacy sport ID if both are present in a URL.
    if (!filters.event && filters.sportId && game.gameType.id !== filters.sportId) continue;
    if (filters.teamId && !playsIn(game, filters.teamId)) continue;
    const start = new Date(game.startDate);
    if (!isValid(start)) continue;
    const date = getScheduleDay(start);
    if (filters.date && date !== filters.date) continue;
    const dayGames = groups.get(date) ?? [];
    dayGames.push(game);
    groups.set(date, dayGames);
  }

  if (anchorDate && !groups.has(anchorDate)) groups.set(anchorDate, []);

  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, games]) => ({
      date,
      games: games.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate) || a.id - b.id),
    }));
}
