"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";

interface DateFilterProps {
  id?: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  className?: string;
  showClear?: boolean;
  disabled?: boolean;
}

export function DateFilter({
  id, selectedDate, onDateSelect, className, showClear = true, disabled = false,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const canClear = showClear && selectedDate;

  function selectDate(date: Date | undefined) {
    onDateSelect(date);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            disabled={disabled}
            variant="outline"
            aria-label={selectedDate ? `Choose date, ${format(selectedDate, "MMMM d, yyyy")}` : "Choose date"}
            className={cn(
              "flex h-13.5 w-full items-center justify-start gap-2 overflow-hidden rounded-[2px] border border-neutral-200 border-l-2 bg-white px-4 shadow-sm hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500",
              canClear && "border-l-tc_primary-500 pr-12",
              className,
            )}
          >
            <CalendarIcon className="size-4 shrink-0" />
            <span className={cn("truncate text-sm", selectedDate ? "font-medium" : "text-muted-foreground")}>
              {selectedDate ? format(selectedDate, "MMM d") : "Select date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={selectDate}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
      {canClear && (
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label="Clear date"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => selectDate(undefined)}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
