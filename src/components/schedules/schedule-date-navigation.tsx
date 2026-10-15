import { addDays, format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import ScheduleBackground from "./schedule-background";

type ScheduleDateNavigationProps = {
  date: string | null;
  today: string | null;
  disabled: boolean;
  onSelect: (date: string) => void;
};

export default function ScheduleDateNavigation({
  date, today, disabled, onSelect,
}: ScheduleDateNavigationProps) {
  const anchor = date ?? today;
  const selectedDate = anchor ? parseISO(anchor) : null;
  const previous = selectedDate ? addDays(selectedDate, -1) : null;
  const next = selectedDate ? addDays(selectedDate, 1) : null;

  return (
    <div className="sticky top-20 z-30 bg-[#f7f6f6] sm:top-24 xl:top-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-4 sm:h-8 xl:h-12">
        <ScheduleBackground />
      </div>
      <nav aria-label="Schedule dates" className="flex min-h-14 items-center justify-center gap-1 rounded-xl bg-[#f7f6f6] px-2 shadow-sm sm:gap-5">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 sm:size-9"
          disabled={disabled || !previous}
          aria-label="Previous day"
          onClick={() => previous && onSelect(format(previous, "yyyy-MM-dd"))}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="ghost"
          disabled={disabled || !previous}
          aria-label={previous ? `Scroll to ${format(previous, "MMMM d, yyyy")}` : "Previous date"}
          onClick={() => previous && onSelect(format(previous, "yyyy-MM-dd"))}
          className="h-10 min-w-0 px-1 text-xs text-neutral-500 sm:text-sm"
        >
          {previous ? format(previous, "MMM d") : "—"}
        </Button>
        <Button
          variant="ghost"
          aria-label={selectedDate ? `Scroll to ${format(selectedDate, "MMMM d, yyyy")}` : "Scroll to today"}
          disabled={disabled || !anchor}
          onClick={() => anchor && onSelect(anchor)}
          className="h-12 px-2 text-xl font-bold sm:text-2xl"
        >
          {anchor === today ? "Today" : selectedDate ? format(selectedDate, "MMM d") : "Today"}
        </Button>
        <Button
          variant="ghost"
          disabled={disabled || !next}
          aria-label={next ? `Scroll to ${format(next, "MMMM d, yyyy")}` : "Next date"}
          onClick={() => next && onSelect(format(next, "yyyy-MM-dd"))}
          className="h-10 min-w-0 px-1 text-xs text-neutral-500 sm:text-sm"
        >
          {next ? format(next, "MMM d") : "—"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 sm:size-9"
          disabled={disabled || !next}
          aria-label="Next day"
          onClick={() => next && onSelect(format(next, "yyyy-MM-dd"))}
        >
          <ArrowRight />
        </Button>
      </nav>
    </div>
  );
}
