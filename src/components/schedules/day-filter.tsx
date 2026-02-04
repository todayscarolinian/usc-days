
"use client"

import * as React from "react"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface DateFilterProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  className?: string
  showClear?: boolean
}

export function DateFilter({ selectedDate, onDateSelect, className, showClear }: DateFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date)
    setIsOpen(false)
  }

  const handleClearDate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDateSelect(undefined)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative flex items-center justify-start gap-2 w-full !px-[16px] !py-[7px] !h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none overflow-hidden",
              selectedDate && "border-l-tc_primary-500 pr-10", // Reduced padding when date is selected
              className
            )}
          >
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            {selectedDate ? (
              <span className="text-sm font-medium truncate">
                {format(selectedDate, "MMM d")}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground truncate">
                Select date
              </span>
            )}
          </Button>
        </PopoverTrigger>
        {selectedDate && (
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center z-10 transition-colors"
            onClick={handleClearDate}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
