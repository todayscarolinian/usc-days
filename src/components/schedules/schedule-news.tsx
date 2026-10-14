"use client";

import Image from "next/image";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import { useFacebookPostsQuery } from "@/src/queries/facebook.queries";
import type { FacebookPost } from "@/src/types/facebook.types";

function NewsItem({ post }: { post: FacebookPost }) {
  const [failed, setFailed] = useState(false);
  const headline = post.message?.split(/\r?\n/).find(line => line.trim()) || "View Facebook post";
  const date = new Date(post.createdTime);
  return <a href={post.permalinkUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 border-b border-neutral-200 py-4 hover:text-tc_primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-500">
    <span className="relative flex h-16 w-[92px] shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-200">
      {post.imageUrl && !failed ? <Image src={post.imageUrl} alt="" fill unoptimized sizes="92px" className="object-cover" onError={() => setFailed(true)} /> : <Newspaper className="size-6 text-neutral-500" aria-hidden="true" />}
    </span>
    <span className="min-w-0"><span className="line-clamp-3 block text-lg leading-tight font-medium">{headline}</span>{!Number.isNaN(+date) && <time dateTime={post.createdTime} className="mt-1 block text-sm text-neutral-600">{new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", month: "long", day: "numeric", year: "numeric" }).format(date)}</time>}<span className="sr-only"> (opens Facebook in a new tab)</span></span>
  </a>;
}

export default function ScheduleNews() {
  const query = useFacebookPostsQuery(FACEBOOK_NEWS_CONFIG.hashtag, FACEBOOK_NEWS_CONFIG.startDate, FACEBOOK_NEWS_CONFIG.endDate, 3);
  return <aside aria-label="Latest news" className="min-w-0 xl:sticky xl:top-20">
    <h2 className="border-b border-neutral-400 py-2.5 text-[32px] font-bold">NEWS</h2>
    {query.isPending ? <div role="status" aria-label="Loading news" className="space-y-4 pt-4">{[0, 1, 2].map(i => <div key={i} className="h-20 bg-white/70 motion-safe:animate-pulse" />)}</div> : query.data?.length ? query.data.map(post => <NewsItem key={post.id} post={post} />) : query.isError ? <div role="alert" className="py-4 text-neutral-600"><p>News is temporarily unavailable.</p><Button variant="link" disabled={query.isFetching} onClick={() => void query.refetch()}>Try again</Button></div> : <p role="status" className="py-4 text-neutral-600">No news posts yet. Check back for updates.</p>}
  </aside>;
}
