import { format, parseISO } from "date-fns";
import { Button } from "@/src/components/ui/button";
import type { ScheduleDay } from "@/src/lib/schedules";
import ScheduleMatch from "./schedule-match";

type ScheduleFeedProps = {
  showEventLabel: boolean;
  days: ScheduleDay[];
  today: string | null;
  now: Date | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
};

export default function ScheduleFeed({
  days, today, now, isLoading, isError, isFetching, onRetry, showEventLabel,
}: ScheduleFeedProps) {
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
      <div role="status" className="rounded-xl bg-[#f7f6f6] p-8 text-center">
        <p className="text-xl font-bold">No matches scheduled.</p>
        <p className="mt-2 text-neutral-500">Choose another date or event to see more matches.</p>
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
      {days.map(day => (
        <section key={day.date} id={`schedule-day-${day.date}`} aria-label={`Matches for ${day.date}`} className="scroll-mt-40 space-y-3 rounded-xl bg-[#f7f6f6] p-4 sm:scroll-mt-44 sm:px-5 sm:py-6 xl:scroll-mt-48">
          <h2 className="text-xl font-bold">
            {day.date === today ? "Today" : format(parseISO(day.date), "MMM d, yyyy").toUpperCase()}
          </h2>
          {!day.games.length && (
            <p className="py-4 text-neutral-500">No matches scheduled for this date.</p>
          )}
          {day.games.map(game => (
            <ScheduleMatch key={game.id} game={game} now={now} showEventLabel={showEventLabel} />
          ))}
        </section>
      ))}
    </div>
  );
}
