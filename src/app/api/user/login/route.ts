import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

// GET /api/user/login
// Gets the redirect URL for Google OAuth
export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();

  // Get the base URL dynamically or from an environment variable
  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  // Initiate the OAuth flow
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Return the Google OAuth URL to redirect the user
  return NextResponse.json({ url: data.url }, { status: 200 });
}