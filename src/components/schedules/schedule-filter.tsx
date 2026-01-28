"use client";

import SportSelector from "@/src/components/ui/sport-selector";

interface SportSelectorProps {
  onSelect: (id: number | null) => void;
  selected: number | null;
}

export default function ScheduleFilter({
  onSelect,
  selected,
}: SportSelectorProps) {
  return (
    <div className="sticky top-16 z-40 flex flex-col bg-white">
      <div className="flex items-center justify-between gap-4 w-full px-4 py-8 sm:max-w-5xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <h2
              className="text-2xl md:text-4xl font-semibold uppercase"
              id="date-reference"
            >
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <span className="text-sm uppercase" id="day-reference">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Click on any game card to view full details
        </p>
        <SportSelector
          onSelect={onSelect}
          selected={selected}
          triggerClassName="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] min-w-full bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
        />
      </div>
    </div>
  );
}
