import { TZDate } from "@date-fns/tz";
import { endOfDay, format, startOfDay } from "date-fns";

export const EVENT_TIMEZONE = "Asia/Manila";
export const DATE_FORMAT = "yyyy-MM-dd";
export const TIME_FORMAT = "HH:mm";
type DateInput = Date | string;

const inEventTz = (value: DateInput) =>
  new TZDate(new Date(value).getTime(), EVENT_TIMEZONE);

export function isEventDayKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  return (
    probe.getUTCFullYear() === y &&
    probe.getUTCMonth() === m - 1 &&
    probe.getUTCDate() === d
  );
}

// Display Manila time in date format e.g 2026-10-20
export function getEventDayKey(value: DateInput = new Date()): string {
  return format(inEventTz(value), DATE_FORMAT);
}

// Display Manila time in time format e.g 7:00
export function getEventTimeOfDay(value: DateInput = new Date()): string {
  return format(inEventTz(value), TIME_FORMAT);
}

export function isEventTimeOfDay(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function eventDateTimeToISO(dayKey: string, time: string): string {
  if (!isEventDayKey(dayKey)) {
    throw new RangeError(`Invalid event day key: "${dayKey}"`);
  }
  if (!isEventTimeOfDay(time)) {
    throw new RangeError(`Invalid event time: "${time}"`);
  }
  const [y, m, d] = dayKey.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new TZDate(y, m - 1, d, h, min, EVENT_TIMEZONE).toISOString();
}

export function getEventDayRange(dayKey: string): { start: Date; end: Date } {
  const [y, m, d] = dayKey.split("-").map(Number);
  const day = new TZDate(y, m - 1, d, EVENT_TIMEZONE);
  return {
    start: new Date(startOfDay(day).getTime()),
    end: new Date(endOfDay(day).getTime()),
  };
}
