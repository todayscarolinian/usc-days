import "server-only";
import { verifySessionFromCookie } from "./verify-session";
import { isAuthorized } from "./authorize";
import type { HeraldUser } from "./types";

export type AccessError = {
  error: "UNAUTHENTICATED" | "FORBIDDEN" | "SERVICE_ERROR";
  message: string;
};
export type AccessResult = { user: HeraldUser } | AccessError;

export function isAccessError(result: AccessResult): result is AccessError {
  return "error" in result;
}

export async function requireHeraldAccess(
  cookieHeader: string | null
): Promise<AccessResult> {
  const result = await verifySessionFromCookie(cookieHeader);

  switch (result.status) {
    case "ok":
      return isAuthorized(result.user)
        ? { user: result.user }
        : {
            error: "FORBIDDEN",
            message: "Your account does not have access to this application.",
          };
    case "unauthenticated":
      return {
        error: "UNAUTHENTICATED",
        message: "You must be logged into Herald to do this.",
      };
    case "disabled":
      return { error: "FORBIDDEN", message: "This account has been disabled." };
    case "error":
      return { error: "SERVICE_ERROR", message: "Could not verify your session right now." };
  }
}
