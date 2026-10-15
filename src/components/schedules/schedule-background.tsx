export default function ScheduleBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#f7f6f6]">
      <div className="absolute inset-0 bg-[url('/schedules/background.png')] bg-[length:1440px_auto] bg-fixed bg-top bg-repeat opacity-50" />
    </div>
  );
}
