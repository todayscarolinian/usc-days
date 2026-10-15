import { format, isValid, parseISO } from "date-fns";
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
  { name: "Soccer", group: "Field", pattern: /soccer|football/i },
  { name: "Futsal", group: "Field", pattern: /futsal/i },
  { name: "Frisbee", group: "Field", pattern: /frisbee/i },
  { name: "Pickleball", group: "Racket", pattern: /pickleball/i },
  { name: "Badminton", group: "Racket", pattern: /badminton/i },
  { name: "Lawn Tennis", group: "Racket", pattern: /lawn tennis/i },
  { name: "Table Tennis", group: "Racket", pattern: /table tennis/i },
  { name: "Chess", group: "Esports", pattern: /chess/i },
  { name: "Mobile Legends", group: "Esports", pattern: /mobile legends/i },
  { name: "Valorant", group: "Esports", pattern: /valorant/i },
  { name: "Esports", group: "Esports", pattern: /e-?sports/i },
  { name: "Swimming", group: "Aquatics", pattern: /swim|freestyle|backstroke|butterfly|breaststroke|medley/i },
  { name: "Cheer Dance", group: "Other Events", pattern: /cheer\s?dance/i },
  { name: "Contemporary Dance", group: "Other Events", pattern: /contemporary dance/i },
  { name: "Mr. & Ms. USC", group: "Other Events", pattern: /mr\.|ms\./i },
] as const;

const EVENT_GROUPS = ["Court", "Field", "Racket", "Esports", "Aquatics", "Other Events"];

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
  today: string | null,
  anchorDate?: string | null,
): ScheduleDay[] {
  const groups = new Map<string, Schedules[]>();

  for (const game of games) {
    if (filters.event && getScheduleEventName(game.gameType.gameName) !== filters.event) continue;
    // A named event supersedes a legacy sport ID if both are present in a URL.
    if (!filters.event && filters.sportId && game.gameType.id !== filters.sportId) continue;
    if (filters.teamId && game.teamA?.id !== filters.teamId && game.teamB?.id !== filters.teamId) continue;
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
    .sort(([a], [b]) => {
      if (!today) return a.localeCompare(b);
      if (a === today) return -1;
      if (b === today) return 1;
      if ((a >= today) !== (b >= today)) return a >= today ? -1 : 1;
      return a >= today ? a.localeCompare(b) : b.localeCompare(a);
    })
    .map(([date, games]) => ({
      date,
      games: games.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate) || a.id - b.id),
    }));
}
