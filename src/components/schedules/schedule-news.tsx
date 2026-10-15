"use client";

import Image from "next/image";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import { SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";
import { useFacebookPostsQuery } from "@/src/queries/facebook.queries";
import type { FacebookPost } from "@/src/types/facebook.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE,
  month: "long",
  day: "numeric",
  year: "numeric",
});

function NewsItem({ post }: { post: FacebookPost }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const headline = post.message?.split(/\r?\n/).find(line => line.trim()) || "View Facebook post";
  const date = new Date(post.createdTime);
  const imageUrl = post.imageUrl !== failedUrl ? post.imageUrl : null;

  return (
    <a
      href={post.permalinkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 border-b border-neutral-200 py-4 hover:text-tc_primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-500"
    >
      <span className="relative flex h-16 w-[92px] shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            sizes="92px"
            className="object-cover"
            onError={() => setFailedUrl(post.imageUrl)}
          />
        ) : (
          <Newspaper className="size-6 text-neutral-500" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-3 block text-lg leading-tight font-medium">{headline}</span>
        {!Number.isNaN(+date) && (
          <time dateTime={post.createdTime} className="mt-1 block text-sm text-neutral-600">
            {dateFormatter.format(date)}
          </time>
        )}
        <span className="sr-only"> (opens Facebook in a new tab)</span>
      </span>
    </a>
  );
}

export default function ScheduleNews() {
  const query = useFacebookPostsQuery(
    FACEBOOK_NEWS_CONFIG.hashtag,
    FACEBOOK_NEWS_CONFIG.startDate,
    FACEBOOK_NEWS_CONFIG.endDate,
    3,
  );
  let content;

  if (query.isPending) {
    content = (
      <div role="status" aria-label="Loading news" className="space-y-4 pt-4">
        {[0, 1, 2].map(index => (
          <div key={index} aria-hidden="true" className="h-20 bg-white/70 motion-safe:animate-pulse" />
        ))}
        <span className="sr-only">Loading news</span>
      </div>
    );
  } else if (query.data?.length) {
    content = query.data.map(post => <NewsItem key={post.id} post={post} />);
  } else if (query.isError) {
    content = (
      <div role="alert" className="py-4 text-neutral-600">
        <p>News is temporarily unavailable.</p>
        <Button variant="link" disabled={query.isFetching} onClick={() => void query.refetch()}>
          {query.isFetching ? "Retrying…" : "Try again"}
        </Button>
      </div>
    );
  } else {
    content = <p role="status" className="py-4 text-neutral-600">No news posts yet. Check back for updates.</p>;
  }

  return (
    <aside aria-label="Latest news" className="min-w-0 xl:sticky xl:top-28 xl:max-h-[calc(100dvh-10rem)] xl:overflow-y-auto">
      <h2 className="py-2.5 font-[family-name:var(--font-roboto-condensed)] text-[32px] font-semibold">NEWS</h2>
      {content}
      {query.isError && !!query.data?.length && (
        <p role="status" className="py-2 text-sm text-neutral-600">
          News could not be refreshed. Showing previously loaded posts.
        </p>
      )}
    </aside>
  );
}
