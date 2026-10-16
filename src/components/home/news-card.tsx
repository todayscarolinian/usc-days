"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { FACEBOOK_NEWS_CONFIG } from "@/src/constants/facebook";
import type { FacebookPost } from "@/src/types/facebook.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: FACEBOOK_NEWS_CONFIG.timeZone,
});

export default function NewsCard({ post }: { post: FacebookPost }) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const messageLines =
    post.message
      ?.split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean) ?? [];
  const headline = messageLines[0] || "View Facebook post";
  const excerpt = messageLines.slice(1).join(" ") || "Read the full post on Facebook.";
  const date = new Date(post.createdTime);
  const hasDate = !Number.isNaN(date.getTime());

  return (
    <article className="min-w-0">
      <a
        href={post.permalinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[6/5] overflow-hidden border-b-2 border-zinc-500 bg-zinc-900 text-white outline-none hover:border-tc_primary focus-visible:border-tc_primary focus-visible:ring-2 focus-visible:ring-tc_primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {post.imageUrl && post.imageUrl !== failedImageUrl ? (
          <Image
            src={post.imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 50vw, 25vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
            onError={() => setFailedImageUrl(post.imageUrl)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <Newspaper className="size-12 text-zinc-500" />
          </div>
        )}

        <div
          className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-zinc-950/75 opacity-0 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:opacity-100"
          aria-hidden="true"
        />
        <ArrowUpRight
          className="absolute top-4 right-4 size-5 opacity-75 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        />

        {/* Reserve three excerpt lines and slide them into view without resizing the card. */}
        <div className="absolute inset-x-0 bottom-0 translate-y-[3.875rem] p-4 group-focus-visible:translate-y-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:none)]:translate-y-0">
          {hasDate ? (
            <time
              dateTime={post.createdTime}
              className="mb-2 block text-xs font-normal tracking-wide text-zinc-200"
            >
              {dateFormatter.format(date)}
            </time>
          ) : null}
          <h3 className="line-clamp-2 text-xl leading-tight font-bold sm:text-2xl">
            {headline}
          </h3>
          <p className="mt-2 h-[3.375rem] line-clamp-3 text-sm leading-[1.125rem] text-zinc-300 opacity-0 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            {excerpt}
          </p>
          <span className="sr-only"> (opens Facebook in a new tab)</span>
        </div>
      </a>
    </article>
  );
}
