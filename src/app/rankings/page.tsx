"use client"

import { useState } from "react";
import { TeamRankingsTable } from "./team-rankings-table";
import { SelectSportButton } from "./select-sport";

export default function RankingSummaryPage() {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  return (
    <div className='p-11'>
      <div className="mb-11">
        <SelectSportButton onSelectSport={setSelectedSport} />
      </div>
      <TeamRankingsTable selectedSport={selectedSport} />
    </div>
  );
}
