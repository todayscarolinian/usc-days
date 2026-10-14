import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, parseQuery } from "@/src/lib/api";
import FacebookService from "@/src/services/facebook.service";
import { FacebookPostsQuerySchema } from "@/src/types/facebook.types";

const facebookService = new FacebookService();

/**
 * GET /api/facebook-posts: Page posts matching a hashtag within an inclusive
 * YYYY-MM-DD date range, newest first. Returns `{ data: FacebookPost[] }`.
 * Invalid query params return 400; service failures use the shared error format.
 * Successful responses allow browser and shared caching for one hour.
 */
export async function GET(req: NextRequest) {
  try {
    const query = parseQuery(
      req.nextUrl.searchParams,
      FacebookPostsQuerySchema,
    );

    if (!query.ok) return query.response;

    const { hashtag, startDate, endDate, limit } = query.data;

    const posts = await facebookService.getPostsByHashtag(hashtag, {
      // Schema validates both dates as required.
      since: startDate!,
      until: endDate!,
      limit,
    });

    return NextResponse.json(
      { data: posts },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  } catch (error) {
    return handleRouteError(error, "Could not fetch Facebook posts.");
  }
}
