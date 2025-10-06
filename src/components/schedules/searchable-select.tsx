import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export interface SelectOption {
    value: string;
    label: string;
    id?: number;
}

type SearchableSelectProps = {
    placeholder: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
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
    className = "",
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
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(`${width} justify-between`, className)}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`${width} p-0`}>
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
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
