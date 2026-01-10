import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
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
}

type SearchableSelectProps = {
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  renderIcon?: (option: SelectOption) => React.ReactNode;
  triggerClassName?: string;
  width?: string;
};

export function SearchableSelect({
  placeholder,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  options,
  value,
  onChange,
  disabled = false,
  renderIcon,
  triggerClassName = "",
  width = "w-full",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    onChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={triggerClassName}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(`${width} justify-between`)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption && renderIcon && renderIcon(selectedOption)}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup heading="Options">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(selectedLabel) => {
                    const selectedOption = options.find(
                      (opt) => opt.label === selectedLabel
                    );
                    if (selectedOption) {
                      handleSelect(selectedOption.value);
                    }
                  }}
                >
                  {renderIcon && (
                    <span className="mr-2 shrink-0">{renderIcon(option)}</span>
                  )}
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
