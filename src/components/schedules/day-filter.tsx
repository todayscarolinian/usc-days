"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  className?: string;
  showClear?: boolean;
}

export function DateFilter({
  selectedDate,
  onDateSelect,
  className,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date);
    setIsOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative flex items-center justify-start gap-2 w-full px-4! py-1.75! h-13.5! bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-2 transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none overflow-hidden",
            selectedDate && "border-l-tc_primary-500 pr-10", // Reduced padding when date is selected
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {selectedDate ? (
            <span className="text-sm font-medium truncate">
              {format(selectedDate, "MMM d")}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground truncate">
              Select date
            </span>
          )}
          {selectedDate && (
            // Converted to div since Button inside Button is not allowed
            <div
              role="button"
              tabIndex={0}
              aria-label="Clear date"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5.5 w-5.5 rounded-sm hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center z-10 transition-colors cursor-pointer"
              onClick={handleClearDate}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClearDate(e as unknown as React.MouseEvent);
                }
              }}
            >
              <X className="h-3 w-3" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
