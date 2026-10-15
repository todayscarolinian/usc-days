"use client";

import { Button } from "@/src/components/ui/button";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import { useFacebookPostsQuery } from "@/src/queries/facebook.queries";
import NewsCard from "./news-card";

interface NewsSectionProps {
  hashtag?: string;
}

const gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4";

export default function NewsSection({
  hashtag = FACEBOOK_NEWS_CONFIG.hashtag,
}: NewsSectionProps) {
  const {
    data: posts,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useFacebookPostsQuery(
    hashtag,
    FACEBOOK_NEWS_CONFIG.startDate,
    FACEBOOK_NEWS_CONFIG.endDate,
    FACEBOOK_NEWS_CONFIG.postLimit,
  );

  return (
    <section id="latest-news" aria-labelledby="latest-news-heading">
      <h2
        id="latest-news-heading"
        className="mb-6 border-b-2 border-foreground pb-3 text-3xl font-bold text-foreground"
      >
        LATEST NEWS
      </h2>

      {isPending ? (
        <div role="status" aria-label="Loading news" className={gridClassName}>
          {Array.from({ length: FACEBOOK_NEWS_CONFIG.postLimit }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="relative aspect-4/3 overflow-hidden border-b-2 border-zinc-400 bg-zinc-200 motion-safe:animate-pulse dark:bg-zinc-800"
            >
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
                <div className="h-3 w-1/2 bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-5 w-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-5 w-3/4 bg-zinc-300 dark:bg-zinc-700" />
              </div>
            </div>
          ))}
          <span className="sr-only">Loading latest Facebook posts.</span>
        </div>
      ) : posts?.length ? (
        <>
          <div className={gridClassName}>
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
          {isError ? (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              News could not be refreshed. Showing previously loaded posts.
            </p>
          ) : null}
        </>
      ) : isError ? (
        <div
          role="alert"
          className="border border-border bg-muted/40 p-6 text-foreground"
        >
          <p className="font-bold">News is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="mt-4"
          >
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      ) : (
        <p
          role="status"
          className="border border-border bg-muted/40 p-6 text-muted-foreground"
        >
          No news posts for this date range. Check back soon for updates.
        </p>
      )}
    </section>
  );
}
