import { useLayoutEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { groupSwimmingMatches, type ScheduleDay } from "@/src/lib/schedules";
import type { Schedules } from "@/src/types/types";
import ScheduleMatch from "./schedule-match";

type ScheduleFeedProps = {
  showEventLabel: boolean;
  categorizeSwimming?: boolean;
  days: ScheduleDay[];
  today: string | null;
  now: Date | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  hasOlder: boolean;
  hasNewer: boolean;
  isLoadingOlder: boolean;
  isLoadingNewer: boolean;
  /** Changes each time an older page lands, so the view can be held in place. */
  olderPageCount: number;
  onLoadOlder: () => void;
  onLoadNewer: () => void;
  onOpenGame: (game: Schedules) => void;
};

function LoadMoreButton({ label, isLoading, onClick }: { label: string; isLoading: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-center">
      <Button variant="outline" disabled={isLoading} onClick={onClick}>
        {isLoading ? "Loading…" : label}
      </Button>
    </div>
  );
}

function EmptySchedule({ forDate = false }: { forDate?: boolean }) {
  return (
    <EmptyState
      title={forDate ? "No matches on this date" : "No matches scheduled"}
      description="Try another date or explore a different event."
    />
  );
}

export default function ScheduleFeed({
  days, today, now, isLoading, isError, isFetching, onRetry, showEventLabel, categorizeSwimming = false,
  hasOlder, hasNewer, isLoadingOlder, isLoadingNewer, olderPageCount, onLoadOlder, onLoadNewer, onOpenGame,
}: ScheduleFeedProps) {
  // Older games are added above the viewport; shift the scroll by the added
  // height so the games already on screen stay put.
  const beforeOlder = useRef<{ height: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const before = beforeOlder.current;
    if (!before) return;
    beforeOlder.current = null;
    const added = document.documentElement.scrollHeight - before.height;
    window.scrollTo({ top: before.top + added, behavior: "instant" });
  }, [olderPageCount]);

  function loadOlder() {
    beforeOlder.current = { height: document.documentElement.scrollHeight, top: window.scrollY };
    onLoadOlder();
  }

  if (isLoading || !now) {
    return (
      <div role="status" aria-label="Loading schedules" className="space-y-6">
        {[0, 1, 2].map(index => (
          <div key={index} aria-hidden="true" className="h-48 rounded-xl bg-white/70 motion-safe:animate-pulse" />
        ))}
        <span className="sr-only">Loading schedules</span>
      </div>
    );
  }

  if (isError && !days.some(day => day.games.length)) {
    return (
      <div role="alert" className="rounded-xl bg-white p-6">
        <p>Schedules could not be loaded.</p>
        <Button variant="outline" disabled={isFetching} onClick={onRetry} className="mt-3">
          {isFetching ? "Retrying…" : "Retry schedules"}
        </Button>
      </div>
    );
  }

  if (!days.length) {
    return (
      <div className="rounded-xl bg-[#f7f6f6] p-4 sm:p-5">
        <EmptySchedule />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isError && (
        <div role="status" className="rounded-xl bg-white p-4 text-sm">
          <p>Schedules could not be refreshed. Showing previously loaded matches.</p>
          <Button variant="link" disabled={isFetching} onClick={onRetry}>Retry schedules</Button>
        </div>
      )}
      {hasOlder && <LoadMoreButton label="Load earlier games" isLoading={isLoadingOlder} onClick={loadOlder} />}
      {days.map(day => (
        <section key={day.date} id={`schedule-day-${day.date}`} aria-label={`Matches for ${day.date}`} className="scroll-mt-40 space-y-3 rounded-xl bg-[#f7f6f6] p-4 sm:scroll-mt-44 sm:px-5 sm:py-6 xl:scroll-mt-48">
          <h2 className="text-xl font-bold">
            {day.date === today ? "Today" : format(parseISO(day.date), "MMM d, yyyy").toUpperCase()}
          </h2>
          {!day.games.length && (
            <EmptySchedule forDate />
          )}
          {categorizeSwimming ? groupSwimmingMatches(day.games).map(category => (
            <section key={category.name} aria-label={category.name} className="space-y-3 pt-2">
              <h3 className="font-[family-name:var(--font-roboto-condensed)] text-lg font-semibold text-neutral-600">{category.name}</h3>
              {category.games.map(game => (
                <ScheduleMatch key={game.id} game={game} now={now} showEventLabel={showEventLabel} onOpen={onOpenGame} />
              ))}
            </section>
          )) : day.games.map(game => (
            <ScheduleMatch key={game.id} game={game} now={now} showEventLabel={showEventLabel} onOpen={onOpenGame} />
          ))}
        </section>
      ))}
      {hasNewer && <LoadMoreButton label="Load later games" isLoading={isLoadingNewer} onClick={onLoadNewer} />}
    </div>
  );
}
