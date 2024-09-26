import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import AuthService from "@/services/auth.service";
import { GoogleUserMetadata } from "@/types/auth.types";

// GET /api/user/session
// Callback after OAuth with Google, exchange authorization code for session and return as JSON
export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  // Extract the code from the URL search params
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

  // Exchange the authorization code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error(
      "Error exchanging code for session:",
      error || "No session found"
    );
    return NextResponse.json(
      {
        error: "Failed to exchange code for session",
        details: error?.message || null,
      },
      { status: 500 }
    );
  }

  const session = data.session;
  const { user_metadata } = session.user;
  const currentUser = user_metadata as GoogleUserMetadata;

  if (!currentUser.email) {
    return NextResponse.json(
      { error: "User data unavailable" },
      { status: 401 }
    );
  }

  // Check if the user exists in the database
  const isUserInDatabase = await AuthService.userInDatabase({
    email: currentUser.email,
  });

  if (!isUserInDatabase) {
    return NextResponse.redirect(`${baseUrl}/auth/login`);
  }

  return NextResponse.json(
    { redirectTo: `${baseUrl}/auth/success`, session, currentUser },
    { status: 200 }
  );
}
