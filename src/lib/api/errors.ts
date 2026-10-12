import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/src/lib/prisma/generated/client";
import type { AccessError } from "@/src/lib/herald/require-access";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "SERVICE_ERROR";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_ERROR: 502,
};

/**
 * Error that services can throw to produce a specific HTTP response,
 * e.g. `throw new ApiError("CONFLICT", "Venue is already booked at that time.")`.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }

  get status() {
    return STATUS_BY_CODE[this.code];
  }
}

/**
 * Standard error body: `{ error, code, details? }`.
 * `error` stays a string so `parseApiError` in `src/lib/error-handler.ts` keeps working.
 */
export function errorResponse(code: ApiErrorCode, message: string, details?: unknown) {
  return NextResponse.json(
    details === undefined ? { error: message, code } : { error: message, code, details },
    { status: STATUS_BY_CODE[code] },
  );
}

export function validationErrorResponse(error: z.ZodError, message = "Validation failed.") {
  return errorResponse("VALIDATION_ERROR", message, z.flattenError(error));
}

export function accessErrorResponse(access: AccessError) {
  return errorResponse(access.error, access.message);
}

/**
 * Converts anything thrown inside a route handler into an error response.
 * Unknown errors are logged and returned as a generic 500 so internals never leak to clients.
 */
export function handleRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.details);
  }

  if (error instanceof z.ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Record required for update/delete/connect was not found
      case "P2025":
        return errorResponse("NOT_FOUND", "The requested resource was not found.");
      // Unique constraint violation
      case "P2002":
        return errorResponse("CONFLICT", "A resource with these values already exists.");
      // Foreign key constraint violation, e.g. deleting a record still referenced elsewhere
      case "P2003":
        return errorResponse("CONFLICT", "This resource is referenced by other records.");
    }
  }

  console.error(fallbackMessage, error);
  return errorResponse("INTERNAL_ERROR", fallbackMessage);
}
