export type Domain =
  | "TC Official Website"
  | "USC Days"
  | "TC Digital Archives"
  | "TC Herald";

export const REQUIRED_DOMAIN: Domain = "USC Days";

export type HeraldUser = {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emailVerified: boolean;
  disabled: boolean;
  positions: string[];
  domains: Domain[];
  createdAt: string;
  updatedAt: string;
};

export type HeraldSession = {
  token: string;
  expiresAt: number;
};

type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export type VerifySessionResponse = APIResponse<{
  valid: true;
  session: HeraldSession;
  user: HeraldUser;
}>;
