import "server-only";
import { createHmac } from "node:crypto";
import { ApiError } from "@/src/lib/api";
import type {
  FacebookPost,
  GetFacebookPostsParams,
  GraphList,
  GraphPost,
} from "@/src/types/facebook.types";

const GRAPH_URL = "https://graph.facebook.com/v26.0";
const POST_FIELDS = "id,message,created_time,permalink_url,full_picture";
const REVALIDATE_SECONDS = 600;
const PAGE_SIZE = 100;
// Safety cap so a wide date range can't page through the Page's entire history.
const MAX_PAGES = 20;

// Graph API "object does not exist / cannot be loaded" error code.
const GRAPH_NOT_FOUND_CODE = 100;

interface FacebookConfig {
  pageId: string;
  accessToken: string;
  appsecretProof?: string;
}

class FacebookService {
  private config(): FacebookConfig {
    const pageId = process.env.FB_PAGE_ID;
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    const appSecret = process.env.FB_APP_SECRET;

    if (!pageId || !accessToken) {
      throw new ApiError("INTERNAL_ERROR", "Facebook integration is not configured.");
    }

    return {
      pageId,
      accessToken,
      appsecretProof: appSecret
        ? createHmac("sha256", appSecret).update(accessToken).digest("hex")
        : undefined,
    };
  }

  /**
   * GETs a Graph URL with auth params applied. Graph error details are never
   * surfaced to clients; a missing object maps to NOT_FOUND only when
   * `notFoundMessage` is given.
   */
  private async graphFetch<T>(
    url: URL,
    config: FacebookConfig,
    notFoundMessage?: string,
  ): Promise<T> {
    url.searchParams.set("access_token", config.accessToken);
    if (config.appsecretProof) {
      url.searchParams.set("appsecret_proof", config.appsecretProof);
    }

    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: REVALIDATE_SECONDS, tags: ["facebook-posts"] },
      });
    } catch {
      throw new ApiError("SERVICE_ERROR", "Could not reach Facebook.");
    }

    if (!res.ok) {
      if (notFoundMessage) {
        const body = (await res.json().catch(() => null)) as
          | { error?: { code?: number } }
          | null;
        if (body?.error?.code === GRAPH_NOT_FOUND_CODE) {
          throw new ApiError("NOT_FOUND", notFoundMessage);
        }
      }
      throw new ApiError("SERVICE_ERROR", "Could not reach Facebook.");
    }

    try {
      return (await res.json()) as T;
    } catch {
      throw new ApiError("SERVICE_ERROR", "Facebook returned an unreadable response.");
    }
  }

  private toFacebookPost(raw: GraphPost): FacebookPost {
    return {
      id: raw.id,
      message: raw.message ?? null,
      createdTime: raw.created_time,
      permalinkUrl: raw.permalink_url,
      imageUrl: raw.full_picture ?? null,
    };
  }

  /** All Page posts created within [since, until], newest first. */
  async getPosts({ since, until, limit }: GetFacebookPostsParams): Promise<FacebookPost[]> {
    const config = this.config();

    let url: URL | undefined = new URL(`${GRAPH_URL}/${config.pageId}/posts`);
    url.searchParams.set("fields", POST_FIELDS);
    url.searchParams.set("since", String(Math.floor(since.getTime() / 1000)));
    url.searchParams.set("until", String(Math.floor(until.getTime() / 1000)));
    url.searchParams.set("limit", String(PAGE_SIZE));

    const posts: FacebookPost[] = [];
    for (let page = 0; url && page < MAX_PAGES; page++) {
      const body: GraphList<GraphPost> = await this.graphFetch(url, config);
      posts.push(...body.data.map((raw) => this.toFacebookPost(raw)));
      if (limit && posts.length >= limit) break;
      url = body.paging?.next ? new URL(body.paging.next) : undefined;
    }

    return this.sortNewestFirst(posts).slice(0, limit);
  }

  /**
   * Page posts within [since, until] whose message contains `#hashtag`
   * (case-insensitive, whole tag only). `hashtag` excludes the leading `#`
   * and must already be validated to `[A-Za-z0-9_]`.
   */
  async getPostsByHashtag(
    hashtag: string,
    { since, until, limit }: GetFacebookPostsParams,
  ): Promise<FacebookPost[]> {
    const pattern = new RegExp(`#${hashtag}(?!\\w)`, "i");
    const posts = await this.getPosts({ since, until });

    return posts
      .filter((post) => post.message !== null && pattern.test(post.message))
      .slice(0, limit);
  }

  async getPostById(id: string): Promise<FacebookPost> {
    const config = this.config();

    const url = new URL(`${GRAPH_URL}/${id}`);
    url.searchParams.set("fields", POST_FIELDS);

    const raw = await this.graphFetch<GraphPost>(url, config, "Facebook post not found.");
    return this.toFacebookPost(raw);
  }

  private sortNewestFirst(posts: FacebookPost[]) {
    return posts.sort(
      (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
    );
  }
}

export default FacebookService;
