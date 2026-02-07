"use client";

import SportSelector from "@/src/components/ui/sport-selector";
import { DateFilter } from "./day-filter";

interface ScheduleFilterProps {
  onSportSelect: (id: number | null) => void;
  selectedSport: number | null;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export default function ScheduleFilter({
  onSportSelect,
  selectedSport,
  onDateSelect,
  selectedDate,
}: ScheduleFilterProps) {
  return (
    <div className="sticky top-16 z-40 flex flex-col bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full px-4 py-8 sm:max-w-5xl mx-auto relative">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex flex-col">
              <h2
                className="text-4xl font-semibold uppercase"
                id="date-reference"
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </h2>
              <span className="text-sm uppercase" id="day-reference">
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                    })
                  : new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
              </span>
            </div>

            <p className="text-sm text-muted-foreground md:text-center">
              Click on a game card to view its details
            </p>

            <SportSelector
              onValueChangeAction={onSportSelect}
              value={selectedSport}
              className="flex items-center justify-between px-5.5! py-1.75! h-13.5! w-full md:max-w-xs bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-2 transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
            />
          </div>
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            className="w-full md:max-w-62"
          />
        </div>
      </div>
    </div>
  );
}
