"use client";

import { useSchedules } from "@/src/hooks/use-schedules";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import ScheduleEvents from "./schedule-events";
import ScheduleDateNavigation from "./schedule-date-navigation";
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleFeed from "./schedule-feed";
import ScheduleNews from "./schedule-news";
import ScheduleBackground from "./schedule-background";
import { cn } from "@/src/lib/utils";
import styles from "./schedules.module.css";

export default function SchedulesPage() {
  const schedules = useSchedules();
  const { hasAccess } = useHasHeraldDomainAccess();
  const { filters } = schedules;
  // The client session may resolve before this route finishes hydrating.
  const canManage = hasAccess && schedules.now !== null;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#f7f6f6] text-[#171717]">
      <ScheduleBackground />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-8 p-4 sm:p-8 xl:grid-cols-[minmax(200px,1fr)_minmax(0,2.75fr)_minmax(200px,1fr)] xl:gap-10 xl:p-12">
        <ScheduleEvents
          groups={schedules.eventGroups}
          selectedEvent={schedules.selectedEvent}
          isLoading={schedules.sports.isPending}
          isError={schedules.sports.isError}
          disabled={schedules.isNavigating}
          onSelect={schedules.selectEvent}
          onRetry={() => void schedules.sports.refetch()}
        />
        <section aria-label="Game schedules" aria-busy={schedules.isNavigating} className="min-w-0 space-y-6">
          <h1 className="sr-only">USC Days game schedules</h1>
          <ScheduleDateNavigation
            date={schedules.navigationDate}
            today={schedules.today}
            disabled={schedules.isNavigating}
            onSelect={schedules.navigateToDate}
            actions={canManage ? <AddScheduleDialog compactTrigger /> : undefined}
          />
          <div
            key={filters.event ?? (filters.sportId ? `sport-${filters.sportId}` : "all")}
            className={cn(styles.feed, schedules.isSwitchingEvent && styles.switching)}
          >
            <ScheduleFeed
              showEventLabel={!filters.event && !filters.sportId}
              days={schedules.days}
              today={schedules.today}
              now={schedules.now}
              isLoading={schedules.isLoading}
              isError={schedules.games.isError}
              isFetching={schedules.games.isFetching}
              onRetry={() => void schedules.games.refetch()}
            />
          </div>
        </section>
        <ScheduleNews />
      </div>
    </div>
  );
}
