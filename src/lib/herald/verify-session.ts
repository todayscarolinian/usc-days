import "server-only";
import type { HeraldUser, VerifySessionResponse } from "./types";

export type VerifySessionResult =
  | { status: "ok"; user: HeraldUser }
  | { status: "unauthenticated" }
  | { status: "disabled" }
  | { status: "error"; message: string };

export async function verifySessionFromCookie(
  cookieHeader: string | null
): Promise<VerifySessionResult> {
  const authUrl = process.env.HERALD_AUTH_URL;
  const internalKey = process.env.HERALD_INTERNAL_API_KEY;
  console.log("Internal Key", internalKey);

  if (!authUrl || !internalKey) {
    return {
      status: "error",
      message: "HERALD_AUTH_URL or HERALD_INTERNAL_API_KEY is not configured",
    };
  }
  if (!cookieHeader) {
    return { status: "unauthenticated" };
  }

  let res: Response;
  try {
    res = await fetch(`${authUrl}/auth/verify-session`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        "x-herald-internal-api-key": internalKey,
      },
      cache: "no-store",
    });
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Network error contacting Herald",
    };
  }

  if (res.status === 401) return { status: "unauthenticated" };
  if (res.status === 403) return { status: "disabled" };
  if (!res.ok) {
    return {
      status: "error",
      message: `Herald verify-session returned ${res.status}`,
    };
  }

  let body: VerifySessionResponse;
  try {
    body = (await res.json()) as VerifySessionResponse;
  } catch {
    return {
      status: "error",
      message: "Herald verify-session returned an unparseable response",
    };
  }

  console.log("verifySessionFromCookie response body:", body);

  if (!body.success || !body.data?.valid || !body.data.user) {
    return { status: "unauthenticated" };
  }
  return { status: "ok", user: body.data.user };
}
