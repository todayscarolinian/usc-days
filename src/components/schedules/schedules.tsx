"use client";

import { useSearchParams, useRouter } from "next/navigation";
import SchedulesList from "@/src/components/schedules/schedules-list";
import { filterType } from "@/src/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleFilter from "./schedule-filter";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";

export default function SchedulesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSport = searchParams.get("sport")
    ? Number(searchParams.get("sport"))
    : null;

  useInitializeUserStore();
  const { email } = useUserStore();

  const currentFilters: filterType | undefined =
    selectedSport && selectedSport !== 0
      ? { game: String(selectedSport) }
      : undefined;

  const handleSportSelect = (sportId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sportId) {
      params.set("sport", sportId.toString());
    } else {
      params.delete("sport");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <ScheduleFilter onSelect={handleSportSelect} selected={selectedSport} />
      <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
        <div className="flex flex-col gap-4">
          {email && (
            <div className="flex justify-end">
              <AddScheduleDialog />
            </div>
          )}
          <SchedulesList filters={currentFilters} />
        </div>
      </div>
    </>
  );
}
