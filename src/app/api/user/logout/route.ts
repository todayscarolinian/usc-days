import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

// GET /api/user/login
// Gets the redirect URL for Google OAuth
export async function GET() {
  const supabase = createSupabaseServerClient();

  // Initiate the OAuth flow
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Return the Google OAuth URL to redirect the user
  return NextResponse.json({ status: 200 });
}
