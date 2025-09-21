import { NextRequest, NextResponse } from 'next/server';
import { generateMetadata } from '@/lib/metadata';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const name = searchParams.get('name');
  const sport = searchParams.get('sport');

  let metadata;

  if (type === 'team' && name) {
    metadata = generateMetadata({
      title: `${name} - USC Days 2024`,
      description: `Follow ${name} team's performance in USC Days 2024 competitions. View scores, schedules, and achievements.`,
      url: `/teams/${encodeURIComponent(name)}`,
      image: `/og-team-${encodeURIComponent(name.toLowerCase())}.png`
    });
  } else if (type === 'sport' && sport) {
    metadata = generateMetadata({
      title: `${sport} - USC Days 2024`,
      description: `${sport} competition results and schedules for USC Days 2024. Follow all matches and team standings.`,
      url: `/sports/${encodeURIComponent(sport)}`,
      image: `/og-sport-${encodeURIComponent(sport.toLowerCase())}.png`
    });
  } else {
    // Default metadata if no valid type provided
    metadata = generateMetadata({
      title: "USC Days 2025 Scoreboard - Today's Carolinian",
      description: 'Scoreboard of the different school teams per game for USC Days 2024',
      url: '/',
    });
  }

  return NextResponse.json({ metadata });
}