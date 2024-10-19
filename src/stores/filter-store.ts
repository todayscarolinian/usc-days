import { filterType } from "@/types/types";
import { create } from "zustand";

interface FilterState {
  date: string;
  game: string;
  teams: { home?: string; away?: string };
  isFilterActive: boolean;
  finishedGames: boolean; // For the checkbox to show finished games
  setFiltered: (filter: filterType) => void;
  clearFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  date: "",
  game: "",
  teams: { home: "", away: "" },
  isFilterActive: false,
  finishedGames: false,
  setFiltered: (filter) => {
    set({
      date: filter.date ?? "",
      game: filter.game ?? "",
      teams: filter.teams ?? { home: "", away: "" },
      finishedGames: filter.finishedGame ?? false,
      isFilterActive: true,
    });
  },
  clearFilter: () => set({
    date: "", 
    game: "", 
    teams: { home: "", away: "" }, 
    isFilterActive: false, 
    finishedGames: false 
  }),
}));