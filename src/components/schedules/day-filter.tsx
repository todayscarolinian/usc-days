
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
}

export function DateFilter({ selectedDate, onDateSelect, className }: DateFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date)
    setIsOpen(false)
  }

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateSelect(undefined)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center justify-center gap-2 !px-[22px] !py-[7px] !h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none",
            selectedDate && "border-l-tc_primary-500",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {selectedDate && (
            <span className="text-sm font-medium">
              {format(selectedDate, "MMM d")}
            </span>
          )}
          {selectedDate && (
            <X 
              className="h-3 w-3 hover:bg-neutral-100 rounded-full p-0.5 ml-1" 
              onClick={handleClearDate}
            />
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
  )
}
