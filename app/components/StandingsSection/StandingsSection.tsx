import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface StandingsSectionProps {
  /** Path inside /public, e.g. "/images/standings/placeholder.png" */
  backgroundImage?: string;
  /** Any CSS object-position value, e.g. "center", "50% 30%", "top" */
  backgroundPosition?: string;
  /** Use "\n" to force a line break */
  heading?: string;
  buttonText?: string;
  buttonHref?: string;
}

const DEFAULTS = {
  backgroundImage: "/standings/placeholder.jpg",
  backgroundPosition: "center",
  heading: "Every Win Counts.\nEvery Rank Matters!",
  buttonText: "Explore Standings",
  buttonHref: "/standings",
} as const;

export default function StandingsSection({
  backgroundImage = DEFAULTS.backgroundImage,
  backgroundPosition = DEFAULTS.backgroundPosition,
  heading = DEFAULTS.heading,
  buttonText = DEFAULTS.buttonText,
  buttonHref = DEFAULTS.buttonHref,
}: StandingsSectionProps) {
  const lines = heading.split("\n");

  return (
    <section
      aria-labelledby="standings-heading"
      className="relative isolate h-[340px] w-full overflow-hidden sm:h-[460px] lg:h-[600px]"
    >
      {/* Background image (replaceable via props) */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: backgroundPosition }}
      />

      {/* Separate dark overlay */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />

      {/* Heading: upper-left */}
      <h2
        id="standings-heading"
        className="absolute left-6 top-8 max-w-[calc(100%-3rem)] text-[1.75rem] font-bold leading-[1.1] tracking-tight text-white sm:left-10 sm:top-12 sm:text-5xl lg:left-20 lg:top-20 lg:text-[4rem]"
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* Button: lower-left */}
      <Link
        href={buttonHref}
        className="absolute bottom-8 left-6 inline-flex items-center gap-3 bg-[#C62828] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#B71C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-12 sm:left-10 sm:px-7 sm:py-4 sm:text-sm lg:bottom-16 lg:left-20 lg:px-8 lg:py-5 lg:text-base"
      >
        {buttonText}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
      </Link>

    </section>
  );
}