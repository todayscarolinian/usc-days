import { CalendarDays, type LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title = "Nothing to show yet",
  description = "Check back soon for updates.",
  icon: Icon = CalendarDays,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-52 flex-col items-center justify-center rounded-lg bg-white/60 px-5 py-8 text-center whitespace-normal sm:py-10",
        className,
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="font-[family-name:var(--font-roboto-condensed)] text-xl font-semibold text-neutral-800">
        {title}
      </p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
    </div>
  );
}
