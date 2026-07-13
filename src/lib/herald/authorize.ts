import { REQUIRED_DOMAIN, type HeraldUser } from "./types";

export function isAuthorized(user: HeraldUser): boolean {
  return user.domains.includes(REQUIRED_DOMAIN);
}
