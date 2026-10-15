import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { sportIcons, sportIconAliases } from "@/src/constants/sportIcons";
import { cn } from "@/src/lib/utils";
import type { ScheduleEventGroup } from "@/src/lib/schedules";

const eventRoutes: Record<string, string> = {
  Basketball: "/sports/basketball",
  Volleyball: "/sports/volleyball",
  "Flag Football": "/sports/flag-football",
  Soccer: "/sports/soccer",
  Futsal: "/sports/futsal",
  Frisbee: "/sports/frisbee",
  Pickleball: "/sports/pickleball",
  Badminton: "/sports/badminton",
  "Lawn Tennis": "/sports/lawn-tennis",
  "Table Tennis": "/sports/table-tennis",
  Chess: "/sports/chess",
  "Mobile Legends": "/sports/mobile-legends",
  Valorant: "/sports/valorant",
  Swimming: "/sports/swimming",
};

type ScheduleEventsProps = {
  groups: ScheduleEventGroup[];
  selectedEvent: string | null;
  isLoading: boolean;
  isError: boolean;
  disabled: boolean;
  onSelect: (event: string | null) => void;
  onRetry: () => void;
};

function eventIcon(name: string) {
  const key = sportIconAliases[name] ?? name;
  return sportIcons[key] ?? sportIcons.Default;
}

export default function ScheduleEvents({
  groups, selectedEvent, isLoading, isError, disabled, onSelect, onRetry,
}: ScheduleEventsProps) {
  const router = useRouter();
  const visibleGroups = groups.filter(group => group.name !== "Other Events");

  function selectMobileEvent(eventName: string) {
    const route = eventRoutes[eventName];
    if (route) router.push(route);
    else onSelect(eventName || null);
  }

  return (
    <aside aria-label="Filter by event" className="min-w-0 xl:sticky xl:top-28 xl:max-h-[calc(100dvh-10rem)] xl:overflow-y-auto">
      <h2 className="py-2.5 font-[family-name:var(--font-roboto-condensed)] text-[32px] font-semibold">EVENTS</h2>
      <label htmlFor="schedule-event" className="sr-only">Filter schedules by event</label>
      <select
        id="schedule-event"
        value={selectedEvent ?? ""}
        disabled={disabled || isLoading}
        onChange={event => selectMobileEvent(event.target.value)}
        className="mt-3 h-12 w-full rounded border border-neutral-300 bg-[#f7f6f6] px-3 text-base focus-visible:outline-2 focus-visible:outline-tc_primary-400 disabled:opacity-50 xl:hidden"
      >
        <option value="">All Events</option>
        {visibleGroups.map(group => (
          <optgroup key={group.name} label={group.name}>
            {group.events.map(event => (
              <option key={event.name} value={event.name}>{event.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <Button
        variant="ghost"
        aria-pressed={!selectedEvent}
        disabled={disabled}
        onClick={() => onSelect(null)}
        className={cn(
          "my-2 hidden h-9 w-full justify-start rounded-none px-2 text-[15px] motion-safe:transition-colors motion-safe:duration-200 motion-reduce:transition-none xl:flex",
          !selectedEvent && "bg-white/40 font-bold",
        )}
      >
        <Image src={sportIcons.Basketball} width={26} height={26} alt="" />
        All Events
      </Button>
      {isLoading && <p role="status" className="py-3 text-sm text-neutral-500">Loading events…</p>}
      <div className="hidden flex-col gap-3 pb-2 xl:flex">
        {visibleGroups.map(group => (
          <div key={group.name}>
            <h3 className="mb-1 text-base text-neutral-500">{group.name}</h3>
            <div>
              {group.events.map(event => {
                const route = eventRoutes[event.name];
                const className = cn(
                  "flex h-auto min-h-9 w-full items-center justify-start rounded-none px-2 py-1 text-[15px] whitespace-normal motion-safe:transition-colors motion-safe:duration-200 motion-reduce:transition-none",
                  route && "cursor-pointer hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-tc_primary-400",
                  selectedEvent === event.name && "bg-white/40 font-bold",
                );
                const content = (
                  <>
                    <Image src={eventIcon(event.name)} width={26} height={26} alt="" className="shrink-0 object-contain" />
                    <span className="min-w-0 text-left">{event.name}</span>
                    {event.isLive && <span className="ml-auto bg-tc_primary-400 px-2 py-0.5 text-xs text-white">Live</span>}
                  </>
                );

                return route ? (
                  <Link key={event.name} href={route} className={className}>
                    {content}
                  </Link>
                ) : (
                  <Button
                    key={event.name}
                    variant="ghost"
                    aria-pressed={selectedEvent === event.name}
                    disabled={disabled}
                    onClick={() => onSelect(event.name)}
                    className={className}
                  >
                    {content}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {isError && (
        <div role="alert" className="text-sm">
          <p>Events could not be loaded.</p>
          <Button variant="link" onClick={onRetry}>Retry events</Button>
        </div>
      )}
    </aside>
  );
}
