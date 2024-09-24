import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import AuthService from "@/services/auth.service";

// GET /api/user
// Checks if the user from OAuth exists in users table. If yes, the session is returned for context saving
export async function GET() {
  // Retrieve the session after the user is redirected back from Google
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json(
      { error: "No session available" },
      { status: 401 }
    );
  }

  const { email } = session.user;

  if (!email) {
    return NextResponse.json(
      { error: "User data unavailable" },
      { status: 401 }
    );
  }

  const currentUser = await AuthService.userInDatabase({ email });
  if (!currentUser) {
    return NextResponse.json({ session: null, currentUser }, { status: 401 });
  }

  // Return the session
  return NextResponse.json({ session, currentUser }, { status: 200 });
}

// POST /api/user
// Gets the redirect URL for Google OAuth
export async function POST() {
  // Initiate the OAuth flow
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Redirect to Google's OAuth URL
  return NextResponse.redirect(data.url);
}
