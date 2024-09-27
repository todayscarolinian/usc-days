import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format a date string into a long date format with time
export function formatLongDate(dateString: string): string {
  // Parse the date string into a JavaScript Date object
  const date = new Date(dateString);

  // Format the date into a long date format with time
  // Example format: "Monday, September 25, 2024, 10:30 AM"
  return format(date, "EEEE, MMMM d, yyyy, h:mm a");
}
