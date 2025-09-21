import { Metadata } from 'next';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import Champions from "@/components/champions/champions";

export const metadata: Metadata = generateMeta({
  title: 'Champions - USC Days 2025',
  description: 'Celebrate the champions of USC Days 2024! View winners across all sports and competitions.',
  url: '/champions',
  image: '/og-champions.png'
});

const ChampionsPage = () => {
  return (
    <div>
      <Champions />
    </div>
  );
};

export default ChampionsPage;
