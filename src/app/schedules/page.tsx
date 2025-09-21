import { Metadata } from 'next';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import Schedules from "@/components/schedules/schedules";

export const metadata: Metadata = generateMeta({
  title: 'Game Schedules - USC Days 2024',
  description: 'Check upcoming game schedules for USC Days 2024. Never miss a match with our comprehensive schedule overview.',
  url: '/schedules',
  image: '/og-schedules.png'
});

export default function SchedulesPage() {
  return (
    <div>
      <Schedules />
    </div>
  );
}
