export default function ScheduleLabel({ label }: { label?: string | null }) {
  if (!label?.trim()) return null;

  return (
    <span className="inline-block max-w-full self-start rounded-md bg-tc_primary-500/10 px-2.5 py-1 text-xs leading-snug font-semibold whitespace-normal text-tc_primary-700 [overflow-wrap:anywhere]">
      {label}
    </span>
  );
}
