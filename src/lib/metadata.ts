import { Metadata } from 'next';

interface MetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    image = '/og-default.png',
    url,
    type = 'website'
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://usc-days.vercel.app';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "USC Days 2025 Scoreboard - Today's Carolinian",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@todayscarolinian',
      site: '@todayscarolinian',
    },
    alternates: {
      canonical: fullUrl,
    },
    verification: {
      google: 'fUlRQaR1gKTOPdr-F-kQFz3T4qAa1MM3fOrb2-s616Y',
    }
  };
}

export const defaultMetadata = generateMetadata({
  title: "USC Days 2025 Scoreboard - Today's Carolinian",
  description: 'Scoreboard of the different school teams per game for USC Days 2025',
  url: '/',
});