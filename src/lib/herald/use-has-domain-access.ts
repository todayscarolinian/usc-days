"use client";
import { useSession } from "./auth-client";
import { REQUIRED_DOMAIN, type HeraldUser } from "./types";

export function useHasHeraldDomainAccess() {
  const { data: session, isPending } = useSession();
  const user = session?.user as HeraldUser | undefined;
  const domains = user?.domains ?? [];

  return {
    isPending,
    isAuthenticated: !!user,
    hasAccess: domains.includes(REQUIRED_DOMAIN),
  };
}
