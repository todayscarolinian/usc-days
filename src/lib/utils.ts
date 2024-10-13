import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLongDate(dateString: string): string {
    const date = new Date(dateString);
    
    return format(date, "MMMM d, yyyy, h:mm a");
  }