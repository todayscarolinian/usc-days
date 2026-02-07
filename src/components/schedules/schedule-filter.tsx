"use client";

import SportSelector from "@/src/components/ui/sport-selector";
import TeamSelector from "@/src/components/ui/team-selector";
import { DateFilter } from "./day-filter";
import { useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "../ui/button";

interface ScheduleFilterProps {
  onSportSelect: (id: number | null) => void;
  selectedSport: number | null;
  onTeamSelect: (id: number | null) => void;
  selectedTeam: number | null;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const SELECTOR_STYLES =
  "flex items-center justify-between px-4 py-2.5 h-[54px] w-full bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-2 transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden";

export default function ScheduleFilter({
  onSportSelect,
  selectedSport,
  onTeamSelect,
  selectedTeam,
  onDateSelect,
  selectedDate,
}: ScheduleFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const displayDate = useMemo(() => selectedDate ?? new Date(), [selectedDate]);

  const formattedDate = useMemo(
    () =>
      displayDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [displayDate],
  );

  const formattedDay = useMemo(
    () =>
      displayDate.toLocaleDateString("en-US", {
        weekday: "long",
      }),
    [displayDate],
  );

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-100">
        <div className="w-full px-6 py-6 sm:max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2
                  className="text-4xl font-semibold uppercase"
                  id="date-reference"
                >
                  {formattedDate}
                </h2>
                <span
                  className="text-sm uppercase text-muted-foreground"
                  id="day-reference"
                >
                  {formattedDay}
                </span>
              </div>
              <p className="text-sm text-muted-foreground md:text-center block sm:hidden">
                Click on a game card to view its details
              </p>
            </div>

            <p className="text-sm text-muted-foreground md:text-center hidden sm:block">
              Click on a game card to view its details
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-tc_primary-500 hover:bg-tc_primary-600 text-white rounded-md transition-colors shadow-sm"
                aria-expanded={isFilterOpen}
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
          {/* Filters Section */}
          {isFilterOpen && (
            <div className="bg-neutral-50/50 border-b border-neutral-100 animate-in slide-in-from-top-2 duration-200">
              <div className="w-full px-4 py-6 sm:max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <DateFilter
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    className="w-full"
                  />
                  <TeamSelector
                    onValueChangeAction={onTeamSelect}
                    value={selectedTeam}
                    className={SELECTOR_STYLES}
                  />
                  <SportSelector
                    onValueChangeAction={onSportSelect}
                    value={selectedSport}
                    className={SELECTOR_STYLES}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
