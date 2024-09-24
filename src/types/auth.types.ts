import { User } from "@prisma/client";
import { Session } from "@supabase/supabase-js";

export interface AuthSession {
  session?: Session,
  currentUser?: User 
}
