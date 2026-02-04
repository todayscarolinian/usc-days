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
        <div className="flex flex-col">
          <h2
            className="text-2xl md:text-4xl font-semibold uppercase"
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
                })
            }
          </h2>
          <span className="text-sm uppercase" id="day-reference">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                })
              : new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                })
            }
          </span>
        </div>

        <p className="text-sm text-muted-foreground md:text-center">
          Click on any game card to view full details
        </p>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 w-full sm:w-auto">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            className="w-full sm:min-w-[120px] sm:max-w-[180px] sm:w-auto"
          />
          
          <SportSelector
            onValueChangeAction={onSportSelect}
            value={selectedSport}
            className="w-full sm:min-w-[140px] sm:max-w-[200px] sm:w-auto flex items-center justify-between !px-[16px] !py-[7px] !h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
