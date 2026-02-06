import { useState, useMemo, useCallback } from "react";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";

export interface SelectOption {
  value: string;
  label: string;
  id?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

type SearchableSelectProps = {
  // Content
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  groupLabel?: string;
  options: SelectOption[];

  // State
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;

  // Features
  clearable?: boolean;
  showCheckmark?: boolean;

  // Styling
  className?: string;
  popoverClassName?: string;

  // Advanced
  filterFunction?: (option: SelectOption, search: string) => boolean;
};

const DEFAULT_PROPS = {
  placeholder: "Select an option...",
  searchPlaceholder: "Search...",
  emptyMessage: "No results found.",
  groupLabel: "Options",
  clearable: false,
  showCheckmark: true,
  loading: false,
} as const;

export function SearchableSelect({
  placeholder = DEFAULT_PROPS.placeholder,
  searchPlaceholder = DEFAULT_PROPS.searchPlaceholder,
  emptyMessage = DEFAULT_PROPS.emptyMessage,
  groupLabel = DEFAULT_PROPS.groupLabel,
  options,
  value,
  onValueChange,
  disabled = false,
  loading = DEFAULT_PROPS.loading,
  clearable = DEFAULT_PROPS.clearable,
  showCheckmark = DEFAULT_PROPS.showCheckmark,
  className,
  popoverClassName,
  filterFunction,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Memoize selected option lookup
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  // Memoize filtered options if custom filter is provided
  const filteredOptions = useMemo(() => {
    if (!filterFunction || !search) return options;
    return options.filter((option) => filterFunction(option, search));
  }, [options, search, filterFunction]);

  // Stable callback for selection
  const handleSelect = useCallback(
    (selectedValue: string) => {
      const newValue = selectedValue === value ? "" : selectedValue;
      onValueChange?.(newValue);
      setOpen(false);
      setSearch("");
    },
    [value, onValueChange],
  );

  // Stable callback for clearing
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.("");
    },
    [onValueChange],
  );

  const isDisabled = disabled || loading;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          disabled={isDisabled}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {loading ? (
              <span className="text-sm">Loading...</span>
            ) : (
              <>
                {selectedOption?.icon && (
                  <span className="shrink-0 flex items-center">
                    {selectedOption.icon}
                  </span>
                )}
                <span className="truncate">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {clearable && selectedOption && !isDisabled && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          popoverClassName,
        )}
        align="start"
      >
        <Command shouldFilter={!filterFunction}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup heading={groupLabel}>
              {(filterFunction ? filteredOptions : options).map((option) => {
                const isSelected = option.value === value;
                const isOptionDisabled = option.disabled || false;

                return (
                  <CommandItem
                    key={`${option.value}-${option.id ?? ""}`}
                    value={option.label}
                    disabled={isOptionDisabled}
                    onSelect={(selectedLabel) => {
                      const selectedOption = options.find(
                        (opt) => opt.label === selectedLabel,
                      );
                      if (selectedOption && !isOptionDisabled) {
                        handleSelect(selectedOption.value);
                      }
                    }}
                    className={cn(
                      "cursor-pointer",
                      isOptionDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {showCheckmark && (
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      )}
                      {option.icon && (
                        <span className="shrink-0 flex items-center">
                          {option.icon}
                        </span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
