import { Metadata } from 'next';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import Scores from "@/components/scores/scores";

export const metadata: Metadata = generateMeta({
  title: 'Scores - USC Days 2025',
  description: 'View scores and results from USC Days 2025 intramural competitions. Follow your favorite teams across all sports.',
  url: '/',
  image: '/og-scores.png'
});

export default function Home() {
  return (
    <div>
      <Scores />
    </div>
  );
}
