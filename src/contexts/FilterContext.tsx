import { createContext, useContext } from "react";
import { filterType } from "@/types/types";

interface FilterContextProps {
  date: string;
  game: string;
  teams: {
    home?: string;
    away?: string;
  };
  status: boolean;
  isFilterActive: boolean;
  setFiltered: (filter: filterType) => void;
  clearFilter: () => void;
}

const defaultFilterContext: FilterContextProps = {
  date: "",
  game: "",
  teams: {
    home: "",
    away: "",
  },
  status: false,
  isFilterActive: false,
  setFiltered: () => {},
  clearFilter: () => {},
};

export const FilterContext =
  createContext<FilterContextProps>(defaultFilterContext);

export const useFilter = () => {
  return useContext(FilterContext);
};
