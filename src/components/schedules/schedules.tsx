"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import SchedulesList from "@/src/components/schedules/schedules-list";
import { filterType } from "@/src/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleFilter from "./schedule-filter";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import { format, parse } from "date-fns";

export default function SchedulesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const selectedSport = searchParams.get("sport")
    ? Number(searchParams.get("sport"))
    : null;

  const selectedDate = useMemo(() => {
    const dateParam = searchParams.get("date");
    if (!dateParam) return undefined;
    try {
      return parse(dateParam, "yyyy-MM-dd", new Date());
    } catch {
      return undefined;
    }
  }, [searchParams]);

  useInitializeUserStore();
  const { email } = useUserStore();

  const currentFilters: filterType | undefined = useMemo(() => {
    const filters: filterType = {};
    
    if (selectedSport && selectedSport !== 0) {
      filters.game = String(selectedSport);
    }
    
    if (selectedDate) {
      filters.date = format(selectedDate, "yyyy-MM-dd");
    }
    
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [selectedSport, selectedDate]);

  const handleSportSelect = (sportId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sportId) {
      params.set("sport", sportId.toString());
    } else {
      params.delete("sport");
    }
    router.push(`?${params.toString()}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <ScheduleFilter 
        onSportSelect={handleSportSelect} 
        selectedSport={selectedSport}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
      <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
        <div className="flex flex-col gap-4">
          {email && (
            <div className="flex justify-end">
              <AddScheduleDialog />
            </div>
          )}
          <SchedulesList filters={currentFilters} selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
}
