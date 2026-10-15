/**
 * Keyset cursor for paging games ordered by `(startDate, id)`.
 * The id breaks ties so games sharing a start time are never skipped.
 */
export type GamesCursor = { startDate: Date; id: number };

export function encodeGamesCursor(game: { startDate: Date; id: number }): string {
  return `${game.startDate.toISOString()}_${game.id}`;
}

export function decodeGamesCursor(value: string): GamesCursor | null {
  const separator = value.lastIndexOf("_");
  if (separator <= 0) return null;
  const startDate = new Date(value.slice(0, separator));
  const id = Number(value.slice(separator + 1));
  if (Number.isNaN(startDate.getTime()) || !Number.isSafeInteger(id) || id <= 0) return null;
  return { startDate, id };
}
