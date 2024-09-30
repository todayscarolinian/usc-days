import { createClient } from "@/utils/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

export function createSupabaseServerClient({
  cookieStore = cookies(),
}: {
  cookieStore?: ReadonlyRequestCookies;
} = {}) {
  // If cookieStore is not provided, fallback to cookies()
  const finalCookieStore = cookieStore || cookies();

  return createClient(finalCookieStore);
}