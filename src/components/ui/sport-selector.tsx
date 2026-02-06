"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import {
  SearchableSelect,
  SelectOption,
} from "@/src/components/ui/searchable-select";

import Badminton from "@/src/assets/icons/Diamond/Badminton.svg";
import Basketball from "@/src/assets/icons/Diamond/Basketball.svg";
import Cheerdance from "@/src/assets/icons/Diamond/Cheerdance.svg";
import Chess from "@/src/assets/icons/Diamond/Chess.svg";
import Esports from "@/src/assets/icons/Diamond/Esports.svg";
import FlagFootball from "@/src/assets/icons/Diamond/Flag Football.svg";
import Football from "@/src/assets/icons/Diamond/Football.svg";
import Frisbee from "@/src/assets/icons/Diamond/Frisbee.svg";
import Futsal from "@/src/assets/icons/Diamond/Futsal.svg";
import LawnTennis from "@/src/assets/icons/Diamond/Lawn Tennis.svg";
import MrIntrams from "@/src/assets/icons/Diamond/Mr Intrams.svg";
import MsIntrams from "@/src/assets/icons/Diamond/Ms Intrams.svg";
import Swimming from "@/src/assets/icons/Diamond/Swimming.svg";
import TableTennis from "@/src/assets/icons/Diamond/Table Tennis.svg";
import ThreeByThreeBasketball from "@/src/assets/icons/Diamond/ThreeByThreeBasketball.svg";
import Volleyball from "@/src/assets/icons/Diamond/Volleyball.svg";
import Default from "@/src/assets/tc-logo-red.png";

// Sport icon mapping configuration
import type { StaticImageData } from "next/image";

const SPORT_ICON_MAP: Record<string, StaticImageData> = {
  Badminton,
  Basketball,
  "Cheer Dance": Cheerdance,
  Chess,
  "E-Sports": Esports,
  "Flag Football": FlagFootball,
  Football,
  Frisbee,
  Futsal,
  "Lawn Tennis": LawnTennis,
  "Mr. USC Days": MrIntrams,
  "Ms. USC Days": MsIntrams,
  Swimming,
  "Table Tennis": TableTennis,
  "3x3 Basketball": ThreeByThreeBasketball,
  Volleyball,
};

// Swimming event aliases
const SWIMMING_ALIASES = [
  "Freestyle",
  "Backstroke",
  "Butterfly",
  "Breaststroke",
  "Medley",
  "Relay",
];

/**
 * Get the appropriate sport icon based on sport name
 * Handles special cases like swimming events and partial matches
 */
const getSportIcon = (sportName: string): React.ReactNode => {
  // Check swimming aliases first
  if (SWIMMING_ALIASES.some((alias) => sportName.includes(alias))) {
    return <Image src={Swimming} alt="Swimming" className="size-6" />;
  }

  // Find exact or partial match
  const iconKey = Object.keys(SPORT_ICON_MAP).find((key) =>
    sportName.includes(key),
  );

  const iconSrc = iconKey ? SPORT_ICON_MAP[iconKey] : Default;
  return <Image src={iconSrc} alt={sportName} className="size-6" />;
};

type SportSelectorProps = {
  // State
  value?: number | null;
  onValueChangeAction?: (id: number | null) => void;

  // Features
  includeAllOption?: boolean;
  allOptionLabel?: string;
  clearable?: boolean;

  // Styling
  className?: string;

  // Labels
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  // Other
  disabled?: boolean;
};

const DEFAULT_PROPS = {
  includeAllOption: true,
  allOptionLabel: "All Sports",
  clearable: false,
  placeholder: "Select a sport",
  searchPlaceholder: "Search sports...",
  emptyMessage: "No sports found.",
} as const;

export default function SportSelector({
  value,
  onValueChangeAction,
  includeAllOption = DEFAULT_PROPS.includeAllOption,
  allOptionLabel = DEFAULT_PROPS.allOptionLabel,
  clearable = DEFAULT_PROPS.clearable,
  className,
  placeholder = DEFAULT_PROPS.placeholder,
  searchPlaceholder = DEFAULT_PROPS.searchPlaceholder,
  emptyMessage = DEFAULT_PROPS.emptyMessage,
  disabled = false,
}: SportSelectorProps) {
  const { data: sports = [], isLoading, error } = getGameTypesQuery();

  // Memoize options to prevent unnecessary re-renders
  const options: SelectOption[] = useMemo(() => {
    const sportOptions = sports.map((sport) => ({
      value: sport.id.toString(),
      label: sport.gameName,
      id: sport.id,
      icon: getSportIcon(sport.gameName),
    }));

    // Add "All Sports" option if enabled
    if (includeAllOption) {
      return [
        {
          value: "",
          label: allOptionLabel,
          id: 0,
          icon: getSportIcon(allOptionLabel),
        },
        ...sportOptions,
      ];
    }

    return sportOptions;
  }, [sports, includeAllOption, allOptionLabel]);

  return (
    <SearchableSelect
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={error ? "Failed to load sports" : emptyMessage}
      options={options}
      value={value ? value.toString() : ""}
      onValueChange={(val) => onValueChangeAction?.(val ? parseInt(val) : null)}
      disabled={disabled}
      loading={isLoading}
      clearable={clearable}
      className={className}
    />
  );
}
