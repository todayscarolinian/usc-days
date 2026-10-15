"use client";

import { useState, type ReactNode } from "react";
import { addDays, format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import ScheduleBackground from "./schedule-background";
import styles from "./schedule-date-navigation.module.css";
import { cn } from "@/src/lib/utils";

type ScheduleDateNavigationProps = {
  date: string | null;
  today: string | null;
  disabled: boolean;
  onSelect: (date: string) => void;
  actions?: ReactNode;
};

function SlidingDateLabel({ text, previousText, direction, prominent = false, compact = false }: {
  text: string;
  previousText?: string;
  direction: "forward" | "backward";
  prominent?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn(styles.dateLabel, previousText && styles[direction], prominent && (compact ? "min-w-12 sm:min-w-20" : "min-w-16 sm:min-w-20"))}>
      {previousText && <span aria-hidden="true" className={styles.previousLabel}>{previousText}</span>}
      <span className={styles.currentLabel}>{text}</span>
    </span>
  );
}

export default function ScheduleDateNavigation({
  date, today, disabled, onSelect, actions,
}: ScheduleDateNavigationProps) {
  const anchor = date ?? today;
  const [animation, setAnimation] = useState<{
    date: string | null;
    previousDate: string | null;
    direction: "forward" | "backward";
  }>({ date: anchor, previousDate: null, direction: "forward" });

  // Derive the direction before the new labels mount, including scroll updates.
  if (animation.date !== anchor) {
    setAnimation({
      date: anchor,
      previousDate: animation.date,
      direction: anchor && animation.date && anchor < animation.date ? "backward" : "forward",
    });
  }

  const oldDate = animation.previousDate ? parseISO(animation.previousDate) : null;
  const selectedDate = anchor ? parseISO(anchor) : null;
  const previous = selectedDate ? addDays(selectedDate, -1) : null;
  const next = selectedDate ? addDays(selectedDate, 1) : null;

  return (
    <div className="sticky top-20 z-30 flex items-center gap-2 bg-[#f7f6f6] sm:top-24 xl:top-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-4 sm:h-8 xl:h-12">
        <ScheduleBackground />
      </div>
      <nav id="schedule-date-navigation" aria-label="Schedule dates" className="grid min-h-14 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center rounded-xl bg-[#f7f6f6] px-2 shadow-sm">
        <div className="col-start-2 flex min-w-0 items-center justify-center gap-1 xl:gap-2">
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
          className={cn("h-10 min-w-0 overflow-hidden px-1 text-xs text-neutral-500 sm:text-sm", actions && "hidden sm:inline-flex")}
        >
          <SlidingDateLabel
            key={anchor}
            text={previous ? format(previous, "MMM d") : "—"}
            previousText={oldDate ? format(addDays(oldDate, -1), "MMM d") : undefined}
            direction={animation.direction}
          />
        </Button>
        <Button
          variant="ghost"
          aria-label={selectedDate ? `Scroll to ${format(selectedDate, "MMMM d, yyyy")}` : "Scroll to today"}
          disabled={disabled || !anchor}
          onClick={() => anchor && onSelect(anchor)}
          className="h-12 overflow-hidden px-2 text-xl font-bold sm:text-2xl"
        >
          <SlidingDateLabel
            key={anchor}
            text={anchor === today ? "Today" : selectedDate ? format(selectedDate, "MMM d") : "Today"}
            previousText={oldDate ? animation.previousDate === today ? "Today" : format(oldDate, "MMM d") : undefined}
            direction={animation.direction}
            prominent
            compact={!!actions}
          />
        </Button>
        <Button
          variant="ghost"
          disabled={disabled || !next}
          aria-label={next ? `Scroll to ${format(next, "MMMM d, yyyy")}` : "Next date"}
          onClick={() => next && onSelect(format(next, "yyyy-MM-dd"))}
          className={cn("h-10 min-w-0 overflow-hidden px-1 text-xs text-neutral-500 sm:text-sm", actions && "hidden sm:inline-flex")}
        >
          <SlidingDateLabel
            key={anchor}
            text={next ? format(next, "MMM d") : "—"}
            previousText={oldDate ? format(addDays(oldDate, 1), "MMM d") : undefined}
            direction={animation.direction}
          />
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
        </div>
        {actions && <div className="col-start-3 justify-self-end pl-1">{actions}</div>}
      </nav>
    </div>
  );
}
