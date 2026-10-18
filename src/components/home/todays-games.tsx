"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useGamesQuery } from "@/src/queries/games.queries";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { getEventDay, getMatchdayGameStatus, selectTodaysGames } from "@/src/lib/todays-games";
import { getScheduleDay, SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";
import { TodaysGamesCard } from "./todays-games-card";
import styles from "./todays-games.module.css";
import { createMockTodaysGames } from "./todays-games.mock";

const REFRESH_INTERVAL = 30_000;
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE,
  month: "long",
  day: "numeric",
  year: "numeric",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE,
  weekday: "long",
});

function GamesSkeleton() {
  return (
    <div role="status" aria-label="Loading today's games" className={styles.fixtures}>
      <span className="sr-only">Loading today&apos;s games…</span>
      <Skeleton className={`${styles.featureSkeleton} rounded-none`} />
      <div className={styles.sidebar} aria-hidden="true">
        <Skeleton className="h-5 w-32 rounded-none" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[105px] w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}

function GamesContent({
  dateLabel,
  now,
  mock,
}: {
  mock: boolean;
  dateLabel: string;
  now: Date;
}) {
  const {
    data: todaysGames,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGamesQuery({
    startDate: dateLabel,
    endDate: dateLabel,
  }, { enabled: !mock, refetchInterval: REFRESH_INTERVAL });

  const { featured, compact } = useMemo(
    () => selectTodaysGames(mock ? createMockTodaysGames(now) : todaysGames ?? [], now),
    [mock, now, todaysGames],
  );

  if (!mock && loading) return <GamesSkeleton />;

  if (!mock && error && !todaysGames) {
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
    const hasRemainingGames = todaysGames?.some((game) => getMatchdayGameStatus(game, now) !== null);
    return (
      <EmptyState
        title={hasRemainingGames
          ? "No confirmed matchups available"
          : todaysGames?.length ? "No more games today" : "No games scheduled"}
        description={hasRemainingGames
          ? "Check back when teams are assigned, or explore the full schedule."
          : "Explore the full schedule for upcoming matches."}
        className="flex-1 [&>p:first-of-type]:text-2xl [&>p:last-of-type]:text-base md:[&>p:first-of-type]:text-3xl md:[&>p:last-of-type]:text-lg"
      />
    );
  }

  return (
    <div className={styles.fixtures}>
      <TodaysGamesCard game={featured[0]} now={now} />
      {compact.length > 0 && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeading}>
            <h3>MORE SCHEDULES</h3>
            <span>{dateFormatter.format(now)}</span>
          </div>
          <div className={styles.moreGames}>
            {compact.map((game) => (
              <TodaysGamesCard key={game.id} game={game} now={now} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TodaysGames({ mock = false }: { mock?: boolean }) {
  const [inView, setInView] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const initialUpdate = window.setTimeout(updateClock, 0);
    const interval = window.setInterval(updateClock, REFRESH_INTERVAL);
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

  const todayString = now ? getScheduleDay(now) : null;
  const eventDay = now ? getEventDay(now, "2026-10-19") : 0;

  return (
    <div
      ref={sectionRef}
      className={styles.section}
    >
      <header className={styles.header}>
        <div className={styles.masthead}>
          <div className={styles.mastheadRow}>
            <p className="font-bold">THE MATCHDAY DESK</p>
            <Link
              href="/schedules"
              className="shrink-0 font-extrabold whitespace-nowrap text-tc_primary-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400"
            >
              FULL SCHEDULE <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.rule} />
        </div>
        <div className={styles.headingRow}>
          <div className="min-w-0">
            <div className={styles.titleGroup}>
              <p className={styles.eyebrow}>
                {now ? (
                  `${weekdayFormatter.format(now).toUpperCase()} / USC DAYS`
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-28 bg-neutral-200"
                  />
                )}
              </p>
              <h2
                id="todays-games-heading"
                className={styles.title}
              >
                TODAY’S GAMES
              </h2>
            </div>
            <p className={styles.intro}>
              On the court. Across campus.
            </p>
          </div>
          <div
            aria-label={`Event day ${eventDay}`}
            className={styles.day}
          >
            <span className={styles.dayLabel}>DAY</span>
            <span className={styles.dayNumber}>
              {String(eventDay).padStart(2, "0")}
            </span>
          </div>
        </div>
      </header>
      {inView && now && todayString ? (
        <GamesContent
          mock={mock}
          dateLabel={todayString}
          now={now}
        />
      ) : (
        <GamesSkeleton />
      )}

    </div>
  );
}
