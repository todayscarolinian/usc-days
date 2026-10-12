import type { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse, validationErrorResponse } from "./errors";

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Reads and validates a JSON body. Malformed JSON and schema failures both return 400.
 *
 *   const body = await parseJsonBody(req, AddTeamSchema);
 *   if (!body.ok) return body.response;
 */
export async function parseJsonBody<S extends z.ZodType>(
  req: Request,
  schema: S,
): Promise<ParseResult<z.infer<S>>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, response: errorResponse("BAD_REQUEST", "Request body must be valid JSON.") };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { ok: false, response: validationErrorResponse(result.error) };
  }
  return { ok: true, data: result.data };
}

/**
 * Validates query params against a schema built from the helpers in `./query-params`.
 * Repeated keys are collapsed to their first value.
 */
export function parseQuery<S extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: S,
): ParseResult<z.infer<S>> {
  const raw = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { ok: false, response: validationErrorResponse(result.error, "Invalid query parameters.") };
  }
  return { ok: true, data: result.data };
}

/**
 * Validates a dynamic `[id]` route segment as a positive integer.
 */
export function parseIdParam(raw: string): ParseResult<number> {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, response: errorResponse("BAD_REQUEST", `Invalid id "${raw}".`) };
  }
  return { ok: true, data: id };
}
