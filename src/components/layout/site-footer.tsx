import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

import Ribbon from "@/src/assets/footer/ribbon.png";
import Ribbon2 from "@/src/assets/footer/ribbon2.png";
import Ribbon3 from "@/src/assets/footer/ribbon3.png";
import TCPrintLogoWhite from "@/src/assets/footer/tc-print-logo-white.png";
import { PUBLICATION } from "@/src/constants/publication";

const contactEmail = "todaysusc@gmail.com";

const links = [
  { href: "/#news", label: "News" },
  { href: "/merchandise", label: "Merch" },
  { href: "/schedules", label: "Schedules" },
  { href: "/standings", label: "Standings" },
];

const socialLinks = [
  {
    href: PUBLICATION.social.twitter,
    label: "Visit Today's Carolinian on Twitter",
    Icon: Twitter,
  },
  {
    href: PUBLICATION.social.instagram,
    label: "Visit Today's Carolinian on Instagram",
    Icon: Instagram,
  },
  {
    href: PUBLICATION.social.facebook,
    label: "Visit Today's Carolinian on Facebook",
    Icon: Facebook,
  },
];

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-5 ${className}`}>
      {socialLinks.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-white transition-colors hover:text-tc_primary-300"
        >
          <Icon className="size-6" />
        </a>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer
      className="relative isolate w-full overflow-hidden border-t-8 border-tc_primary bg-[#151515] text-white"
      style={{
        backgroundImage: "url('/black-bg.png')",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat-y",
        backgroundSize: "100% auto",
      }}
    >
      {/* Desktop decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden min-[1440px]:block"
      >
        <Image
          src={Ribbon}
          alt=""
          className="absolute -bottom-4 -left-20 h-auto w-[clamp(18rem,38vw,28rem)] object-contain opacity-60"
        />

        <Image
          src={Ribbon2}
          alt=""
          className="absolute -right-24 -bottom-8 h-auto w-[clamp(22rem,42vw,32rem)] object-contain opacity-60"
        />

        <Image
          src={Ribbon3}
          alt=""
          className="absolute -top-48 -right-12 hidden h-auto w-[clamp(9rem,14vw,12rem)] object-contain opacity-60 lg:block"
        />
      </div>

      {/* Mobile footer */}
      <div className="relative z-10 mx-auto max-w-lg px-6 py-10 md:hidden">
        <div className="pb-8">
          <Image
            src={TCPrintLogoWhite}
            alt="Today's Carolinian logo"
            className="mx-auto h-auto w-full max-w-64"
          />
        </div>

        <div className="border-t border-white/20">
          <details className="group border-b border-white/20">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-bold uppercase tracking-wider text-white [&::-webkit-details-marker]:hidden">
              Explore

              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>

            <ul className="space-y-3 pb-5 text-sm text-white/70">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <details className="group border-b border-white/20">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-bold uppercase tracking-wider text-white [&::-webkit-details-marker]:hidden">
              Contact Us

              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>

            <div className="pb-5">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-block max-w-full break-all text-sm text-white/70 transition-colors hover:text-white"
              >
                {contactEmail}
              </a>
            </div>
          </details>
        </div>

        <SocialLinks className="mt-8" />
      </div>

      {/* Desktop footer */}
      <div className="relative z-10 mx-auto hidden max-w-7xl grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-8 px-6 py-12 md:grid lg:px-8 lg:py-14">
        <div className="min-w-0">
          <div className="mb-4 max-w-80">
            <Image
              src={TCPrintLogoWhite}
              alt="Today's Carolinian logo"
              className="h-auto w-full"
            />
          </div>

          <p className="max-w-md text-sm leading-6 text-white/65">
            {PUBLICATION.bio}
          </p>
        </div>

        <nav className="min-w-0" aria-label="Footer navigation">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-tc_primary-300">
            Explore
          </h2>

          <ul className="space-y-2 text-sm text-white/70">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-0.5 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-tc_primary-300">
            Contact Us
          </h2>

          <a
            href={`mailto:${contactEmail}`}
            className="inline-block max-w-full break-all text-sm text-white/70 transition-colors hover:text-white"
          >
            {contactEmail}
          </a>

          <SocialLinks className="mt-6" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl border-t border-white/25 px-5 py-5 text-center text-[11px] leading-relaxed text-white/50 sm:px-6 sm:text-xs lg:px-8">
        © Copyright {new Date().getFullYear()}. All Rights Reserved
      </div>
    </footer>
  );
}
