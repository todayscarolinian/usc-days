"use client";

import { FilterContext } from "@/contexts/FilterContext";
import { useState } from "react";
import { filterType } from "@/types/types";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [date, setDate] = useState<string>("");
  const [game, setGame] = useState<string>("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [teams, setTeams] = useState<{ home?: string; away?: string }>({
    home: "",
    away: "",
  });

  // Function to update filter values
  const setFiltered = (filter: filterType) => {
    if (filter.date !== undefined) setDate(filter.date);
    if (filter.game !== undefined) setGame(filter.game);
    if (filter.teams !== undefined) setTeams(filter.teams);

    setIsFilterActive(true);
  };

  const clearFilter = () => {
    setDate("");
    setGame("");
    setTeams({
      home: "",
      away: "",
    });

    setIsFilterActive(false);
  };

  return (
    <FilterContext.Provider
      value={{
        date,
        game,
        teams,
        setFiltered,
        clearFilter,
        isFilterActive,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
