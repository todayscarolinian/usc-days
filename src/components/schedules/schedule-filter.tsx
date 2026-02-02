"use client";

import { Button } from "@/src/components/ui/button";
import SportSelector from "@/src/components/ui/sport-selector";
import { DateFilter } from "./day-filter";
import { X } from "lucide-react";

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
  const hasActiveFilters = selectedSport !== null || selectedDate !== undefined;

  const handleClearAllFilters = () => {
    onSportSelect(null);
    onDateSelect(undefined);
  };

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
        
        <div className="flex items-center gap-2">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
          
          <SportSelector
            onValueChangeAction={onSportSelect}
            value={selectedSport}
            className="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] max-w-xs bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
          />
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearAllFilters}
              className="flex items-center justify-center !px-[22px] !py-[7px] !h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 outline-none"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
