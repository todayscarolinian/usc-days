"use client";

import { useMemo } from "react";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import {
  SearchableSelect,
  SelectOption,
} from "@/src/components/ui/searchable-select";
import { getIconFor } from "@/src/lib/utils";
import Image from "next/image";

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
      icon: <Image src={getIconFor(sport.gameName)} alt={sport.gameName} className="size-6" />,
    }));

    // Add "All Sports" option if enabled
    if (includeAllOption) {
      return [
        {
          value: "",
          label: allOptionLabel,
          id: 0,
          icon: <Image src={getIconFor(allOptionLabel)} alt={allOptionLabel} className="size-6" />,
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
