"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { format } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useGamesQuery } from "@/src/queries/games.queries";
import type { Schedules } from "@/src/types/types";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { getEventDay, selectTodaysGames } from "@/src/lib/todays-games";
import { TodaysGamesCard } from "./todays-games-card";

const GameDetailsDialog = dynamic(
  () => import("@/src/components/schedules/game-details-dialog"),
  { ssr: false },
);
const AddScoreDialog = dynamic(
  () => import("@/src/components/schedules/add-score-dialog"),
  { ssr: false },
);

function GamesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading today's games"
      className="space-y-6 md:px-3 xl:px-6"
    >
      <span className="sr-only">Loading today&apos;s games…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-5 py-2.5 md:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-[220px] bg-white p-2.5">
            <div className="flex h-full flex-col border border-neutral-300">
              <Skeleton className="mx-3 mt-7 h-5 w-24 animate-none rounded-none bg-neutral-200" />
              <Skeleton className="mx-3 my-auto h-16 animate-none rounded-none bg-neutral-100" />
              <div className="border-t-2 border-neutral-300 p-2">
                <Skeleton className="h-3 w-40 animate-none rounded-none bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-2.5 py-[11.5px] md:grid-cols-2 xl:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-[93px] border border-neutral-300 bg-white p-2.5">
            <Skeleton className="h-5 animate-none rounded-none border-b border-neutral-300 bg-neutral-100" />
            <Skeleton className="mt-2 h-8 animate-none rounded-none bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function GamesContent({
  dateLabel,
  now,
  onOpenGame,
}: {
  dateLabel: string;
  now: Date;
  onOpenGame: (g: Schedules) => void;
}) {
  const {
    data: todaysGames = [],
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGamesQuery({
    startDate: dateLabel,
    endDate: dateLabel,
  });

  const { featured, compact } = useMemo(
    () => selectTodaysGames(todaysGames),
    [todaysGames],
  );

  if (loading) return <GamesSkeleton />;

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 py-12 text-center"
      >
        <p>Failed to load today&apos;s games.</p>
        <Button
          type="button"
          variant="link"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="h-auto cursor-pointer rounded-none p-0 font-bold text-tc_primary-400 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400 disabled:cursor-wait"
        >
          {isFetching ? "Retrying…" : "Retry"}
        </Button>
      </div>
    );
  }

  if (featured.length === 0) {
    return (
      <EmptyState
        title="No games scheduled"
        description="Explore the full schedule for upcoming matches."
        className="flex-1"
      />
    );
  }

  return (
    <div className="space-y-6 md:px-3 xl:px-6">
      <div className="grid grid-cols-1 gap-5 py-2.5 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((game) => (
          <TodaysGamesCard
            key={game.id}
            game={game}
            now={now}
            onOpen={onOpenGame}
          />
        ))}
      </div>
      {compact.length > 0 && (
        <div className="grid grid-cols-1 gap-2.5 py-[11.5px] md:grid-cols-2 xl:grid-cols-4">
          {compact.map((game) => (
            <TodaysGamesCard
              key={game.id}
              game={game}
              now={now}
              compact
              onOpen={onOpenGame}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TodaysGames() {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [scoreGame, setScoreGame] = useState<Schedules | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const initialUpdate = window.setTimeout(updateClock, 0);
    const interval = window.setInterval(updateClock, 60_000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(timeout);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const todayString = now ? format(now, "yyyy-MM-dd") : null;
  const eventDay = now ? getEventDay(now) : 0;

  function openGame(game: Schedules) {
    setSelectedGame(game);
    setOpen(true);
  }

  return (
    <div
      ref={sectionRef}
      className="flex flex-1 flex-col gap-6 py-8 text-[#171717] xl:py-12"
    >
      <header className="shrink-0 space-y-8 border-b border-[#171717] pb-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm leading-[22px] md:text-lg">
            <p className="font-bold">THE MATCHDAY DESK</p>
            <Link
              href="/schedules"
              className="shrink-0 font-extrabold whitespace-nowrap text-tc_primary-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400"
            >
              FULL SCHEDULE <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="h-0.5 bg-[#171717]" />
        </div>
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="space-y-2 md:min-h-[102px]">
              <p className="min-h-6 text-base leading-6 font-bold text-tc_primary-400">
                {now ? (
                  format(now, "EEEE").toUpperCase()
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-20 bg-neutral-200"
                  />
                )}
              </p>
              <h2
                id="todays-games-heading"
                className="text-[32px] leading-10 font-extrabold min-[375px]:text-[36px] md:text-[64px] md:leading-[58px]"
              >
                TODAY’S GAMES
              </h2>
            </div>
            <p className="text-base leading-7 font-medium text-[#4B5563] md:text-xl">
              On the court. Across campus.
            </p>
          </div>
          <div
            aria-label={`Event day ${eventDay}`}
            className="flex shrink-0 flex-col items-end gap-1 font-bold text-tc_primary-400"
          >
            <span className="text-base leading-6">DAY</span>
            <span className="text-[64px] leading-[68px] md:text-[96px] md:leading-[100px]">
              {String(eventDay).padStart(2, "0")}
            </span>
          </div>
        </div>
      </header>
      {inView && now && todayString ? (
        <GamesContent
          dateLabel={todayString}
          now={now}
          onOpenGame={openGame}
        />
      ) : (
        <GamesSkeleton />
      )}
      {selectedGame && (
        <GameDetailsDialog
          open={open}
          onOpenChange={setOpen}
          game={selectedGame}
          onAddScore={(g) => {
            setScoreGame(g);
            setScoreOpen(true);
          }}
        />
      )}
      {scoreGame && (
        <AddScoreDialog
          open={scoreOpen}
          onOpenChange={setScoreOpen}
          game={scoreGame}
        />
      )}
    </div>
  );
}
