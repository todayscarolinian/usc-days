import Link from "next/link";
import {
    Twitter,
    Facebook,
    Instagram,
} from "lucide-react";
import { PUBLICATION } from "@/src/constants/publication";
import Image from "next/image";

const links = [
    { href: "/#news", label: "News" },
    { href: "/#featured-merch", label: "Merch" },
    { href: "/schedules", label: "Schedules" },
    { href: "/standings", label: "Standings" },
    { href: "/leaderboards", label: "Leaderboards" },
];


export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t-8 border-tc_primary bg-[#151515] text-white"
            style={{
                backgroundImage: "url('/black-bg.png')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
    >
        <Image
            src="/ribbon3.png"
            alt=""
            aria-hidden="true"
            width={333}
            height={800}
            className="pointer-events-none absolute right-0 -top-40 z-[1] hidden h-auto w-28 object-contain sm:block md:-top-52 md:w-36 lg:-top-64 lg:w-48"
        />

        <Image
            src="/ribbon.png"
            alt=""
            aria-hidden="true"
            width={548}
            height={325}
            className="pointer-events-none absolute bottom-0 -left-13 z-0 h-auto w-56 object-contain sm:w-72z md:w-80 lg:w-[28rem]"
        />

        <Image
            src="/ribbon2.png"
            alt=""
            aria-hidden="true"
            width={889}
            height={391}
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-64 object-contain sm:w-80 md:w-96 lg:w-[32rem]"
        />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex max-w-sm flex-col items-start gap-3">

            <Image
                src="/tc-print-logo-white.png"
                alt="Today's Carolinian Logo"
                width={2000}
                height={304}
                className="h-auto w-full max-w-80"
            />
          </div>

          <p className="max-w-md text-sm text-white/60">
            {PUBLICATION.bio}
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-tc_primary-300">
            Explore
          </h2>

          <ul className="space-y-2 text-sm text-white/70">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-tc_primary-300">
            CONTACT US
          </h2>

          <span
            className="mb-5 flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            todaysusc@gmail.com
          </span>

          <div className="mt-6 flex items-center gap-6">
            <a
                href={PUBLICATION.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Today's Carolinian on Facebook"
                className="text-white transition-colors hover:text-tc_primary-300"
            >
                <Twitter className="size-6" />
            </a>

            <a
                href={PUBLICATION.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Today's Carolinian on Instagram"
                className="text-white transition-colors hover:text-tc_primary-300"
            >
                <Instagram className="size-6" />
            </a>

            <a
                href={PUBLICATION.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Today's Carolinian on YouTube"
                className="text-white transition-colors hover:text-tc_primary-300"
            >
                <Facebook className="size-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/25 px-6 py-5 text-center text-xs text-white/50">
        © Copyright {new Date().getFullYear()}. All Rights Reserved
      </div>
    </footer>
  );
}