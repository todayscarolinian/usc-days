"use client";

import { useMemo } from "react";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import {
  SearchableSelect,
  SelectOption,
} from "@/src/components/ui/searchable-select";
import { schoolLogos } from "@/src/constants/schoolLogos";
import Image from "next/image";
import { getLogoForSchool } from "@/src/lib/utils";

type TeamSelectorProps = {
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
  allOptionLabel: "All Teams",
  clearable: false,
  placeholder: "Select a team",
  searchPlaceholder: "Search teams...",
  emptyMessage: "No teams found.",
} as const;

export default function TeamSelector({
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
}: TeamSelectorProps) {
  const { data: teams = [], isLoading, error } = getTeamsQuery();

  // Memoize options to prevent unnecessary re-renders
  const options: SelectOption[] = useMemo(() => {
    const teamOptions = teams.map((team) => {
      // Get the icon for this team from schoolLogos
      const icon = getLogoForSchool(team.teamName);

      return {
        value: team.id.toString(),
        label: team.teamName,
        id: team.id,
        icon: <Image src={icon} alt={team.teamName} className="size-6" />,
      };
    });

    // Add "All Teams" option if enabled
    if (includeAllOption) {
      return [
        {
          value: "",
          label: allOptionLabel,
          id: 0,
          icon: (
            <Image
              src={schoolLogos.Default}
              alt={allOptionLabel}
              className="size-6"
            />
          ),
        },
        ...teamOptions,
      ];
    }

    return teamOptions;
  }, [teams, includeAllOption, allOptionLabel]);

  return (
    <SearchableSelect
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={error ? "Failed to load teams" : emptyMessage}
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
