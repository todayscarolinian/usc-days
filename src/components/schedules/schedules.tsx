"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Schedules } from "@/src/types/types";
import { useSchedules } from "@/src/hooks/use-schedules";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import ScheduleEvents from "./schedule-events";
import ScheduleDateNavigation from "./schedule-date-navigation";
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleFeed from "./schedule-feed";
import ScheduleNews from "./schedule-news";
import ScheduleBackground from "./schedule-background";
import styles from "./schedules.module.css";

const GameDetailsDialog = dynamic(() => import("./game-details-dialog"), { ssr: false });
const AddScoreDialog = dynamic(() => import("./add-score-dialog"), { ssr: false });
const EditScheduleDialog = dynamic(() => import("./edit-schedule-dialog"), { ssr: false });

export default function SchedulesPage() {
  const schedules = useSchedules();
  const { hasAccess } = useHasHeraldDomainAccess();
  const [detailsGame, setDetailsGame] = useState<Schedules | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [scoreGame, setScoreGame] = useState<Schedules | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [editGame, setEditGame] = useState<Schedules | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const layout = layoutRef.current;
    const feed = feedRef.current;
    if (!layout || !feed) return;
    let frame = 0;
    const desktop = window.matchMedia("(min-width: 1280px)");

    function update() {
      frame = 0;
      if (!layout || !feed) return;
      const rails = layout.querySelectorAll<HTMLElement>(`[data-schedule-sidebar]`);
      for (const rail of rails) {
        if (!desktop.matches) {
          rail.style.removeProperty("--sidebar-top");
          continue;
        }
        const top = rail.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - 112;
        // Stop following as soon as the feed's bottom reaches the viewport's bottom.
        const limit = Math.max(0, feed.getBoundingClientRect().height - availableHeight);
        const offset = Math.min(limit, Math.max(0, 112 - top));
        rail.style.setProperty("--sidebar-top", `${offset}px`);
      }
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(feed);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  // The client session may resolve before this route finishes hydrating.
  const canManage = hasAccess && schedules.now !== null;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#f7f6f6] text-[#171717]">
      <ScheduleBackground />
      <div ref={layoutRef} className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-8 p-4 sm:p-8 xl:grid-cols-[minmax(200px,1fr)_minmax(0,2.75fr)_minmax(200px,1fr)] xl:gap-10 xl:p-12">
        <div data-schedule-sidebar className={styles.sidebarRail}>
          <ScheduleEvents
          groups={schedules.eventGroups}
          selectedEvent={schedules.selectedEvent}
          isLoading={schedules.sports.isPending}
          isError={schedules.sports.isError}
          disabled={schedules.isNavigating}
          onSelect={schedules.selectEvent}
          onRetry={() => void schedules.sports.refetch()}
          />
        </div>
        <section ref={feedRef} aria-label="Game schedules" aria-busy={schedules.isNavigating} className="min-w-0 space-y-6">
          <h1 className="sr-only">USC Days game schedules</h1>
          <ScheduleDateNavigation
            date={schedules.navigationDate}
            today={schedules.today}
            disabled={schedules.isNavigating}
            onSelect={schedules.navigateToDate}
            actions={canManage ? (
              <AddScheduleDialog compactTrigger />
            ) : undefined}
          />
          <div key={schedules.selectedEvent ?? "all"} className={styles.feed}>
            <ScheduleFeed
              categorizeSwimming={schedules.selectedEvent === "Swimming"}
              showEventLabel
              days={schedules.days}
              today={schedules.today}
              now={schedules.now}
              isLoading={schedules.isLoading}
              isError={schedules.games.isError}
              isFetching={schedules.games.isFetching}
              onRetry={() => void schedules.games.refetch()}
              hasOlder={schedules.games.hasOlder}
              hasNewer={schedules.games.hasNewer}
              isLoadingOlder={schedules.games.isLoadingOlder}
              isLoadingNewer={schedules.games.isLoadingNewer}
              olderPageCount={schedules.games.pastPageCount}
              onLoadOlder={() => void schedules.games.loadOlder()}
              onLoadNewer={() => void schedules.games.loadNewer()}
              canManage={canManage}
              onOpenGame={(game) => { setDetailsGame(game); setDetailsOpen(true); }}
              onEditScore={(game) => { setScoreGame(game); setScoreOpen(true); }}
              onEditSchedule={(game) => { setEditGame(game); setEditOpen(true); }}
            />
          </div>
        </section>
        <div data-schedule-sidebar className={styles.sidebarRail}>
          <ScheduleNews />
        </div>
      </div>
      {detailsGame && (
        <GameDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          game={detailsGame}
          now={schedules.now ?? undefined}
          onEditSchedule={(game) => {
            setDetailsOpen(false);
            setEditGame(game);
            setEditOpen(true);
          }}
          onAddScore={(game) => {
            setDetailsOpen(false);
            setScoreGame(game);
            setScoreOpen(true);
          }}
        />
      )}
      {scoreGame && (
        <AddScoreDialog open={scoreOpen} onOpenChange={setScoreOpen} game={scoreGame} />
      )}
      {editGame && (
        <EditScheduleDialog open={editOpen} onOpenChange={setEditOpen} schedule={editGame} />
      )}
    </div>
  );
}
