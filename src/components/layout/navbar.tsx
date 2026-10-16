"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CircleUser, Menu } from "lucide-react";

import TCRedLogo from "@/src/assets/tc-logo-red.png";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import { signOutFromHerald } from "@/src/lib/herald/auth-client";

type NavigationItem = {
  href: string;
  name: string;
  external?: boolean;
};

const leftNavigation: NavigationItem[] = [
  {
    href: "/",
    name: "Home",
  },
  // Hidden from prod until merch is ready to launch
  // {
  //   href: "/merchandise",
  //   name: "Merch",
  // },
];

const rightNavigation: NavigationItem[] = [
  {
    href: "/schedules",
    name: "Schedules",
  },
  {
    href: "/standings",
    name: "Standings",
  },
];

const allNavigation = [
  ...leftNavigation,
  ...rightNavigation,
];

type UserAvatarProps = {
  onLogout: () => void;
  isPending: boolean;
};

function UserAvatar({
  onLogout,
  isPending,
}: UserAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-white hover:bg-white/15 hover:text-white"
        >
          <CircleUser className="size-5" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-muted-foreground">
          My Account
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isPending}
          onClick={onLogout}
        >
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useHasHeraldDomainAccess();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasHero, setHasHero] = useState(
    pathname === "/" || pathname === "/standings",
  );
  const [isOverHero, setIsOverHero] = useState(
    pathname === "/" || pathname === "/standings",
  );

  const sportParameter = searchParams.get("sport");

  useEffect(() => {
    function updateNavbar() {
      const hero =
        document.getElementById("page-hero") ??
        document.getElementById("site-hero");

      setHasHero(Boolean(hero));
      setIsOverHero(
        Boolean(
          hero &&
            hero.getBoundingClientRect().bottom > 64,
        ),
      );
    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
      passive: true,
    });
    window.addEventListener("resize", updateNavbar);

    return () => {
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("resize", updateNavbar);
    };
  }, [pathname]);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await signOutFromHerald();
      window.location.reload();
    } finally {
      setIsLoggingOut(false);
    }
  }

  function getHref(item: NavigationItem) {
    if (
      item.external ||
      !sportParameter ||
      item.href === "/" ||
      item.href.includes("#")
    ) {
      return item.href;
    }

    return `${item.href}?sport=${encodeURIComponent(
      sportParameter,
    )}`;
  }

  function isActive(item: NavigationItem) {
    if (item.external || item.href.includes("#")) {
      return false;
    }

    return pathname === item.href;
  }

  function renderDesktopLink(item: NavigationItem) {
    const active = isActive(item);

    const className = [
      "relative px-2 py-2 text-base font-medium whitespace-nowrap text-white lg:text-lg",
      "transition-colors hover:text-white/75",
      active
        ? "after:absolute after:-bottom-0.5 after:left-2 after:right-2 after:h-0.5 after:bg-tc_primary-500"
        : "",
    ].join(" ");

    if (item.external) {
      return (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link
        key={item.name}
        href={getHref(item)}
        className={className}
      >
        {item.name}
      </Link>
    );
  }

  function renderMobileLink(item: NavigationItem) {
    const className = [
      "block border-b border-white/10 py-3 text-lg font-medium",
      isActive(item)
        ? "font-bold text-white"
        : "text-white/75",
    ].join(" ");

    if (item.external) {
      return (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={() => setIsSheetOpen(false)}
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link
        key={item.name}
        href={getHref(item)}
        className={className}
        onClick={() => setIsSheetOpen(false)}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <header
      className={[
        "top-0 z-50 flex h-16 w-full items-center transition-all duration-300",
        hasHero ? "fixed" : "sticky",
        isOverHero
          ? "bg-transparent"
          : "bg-tc_primary shadow-md",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden grid-cols-[1fr_auto_1fr] items-center gap-8 md:grid"
        >
          <div className="flex items-center justify-end gap-5 lg:gap-15">
            {leftNavigation.map(renderDesktopLink)}
          </div>

          <Link
            href="/"
            aria-label="Today's Carolinian home"
            className="flex items-center justify-center px-4"
          >
            <Image
              src={TCRedLogo}
              alt="Today's Carolinian logo"
              width={48}
              height={48}
              priority
              className="size-11 object-contain"
            />
          </Link>

          <div className="flex items-center justify-start gap-5 lg:gap-15">
            {rightNavigation.map(renderDesktopLink)}

            {isAuthenticated && (
              <UserAvatar
                onLogout={handleLogout}
                isPending={isLoggingOut}
              />
            )}
          </div>
        </nav>

        {/* Mobile navigation */}
        <div className="relative flex items-center justify-between md:hidden">
          <Sheet
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
          >
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/15 hover:text-white"
              >
                <Menu className="size-6" />
                <span className="sr-only">
                  Open navigation menu
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="border-none bg-[#151515] p-6 text-white"
            >
              <Link
                href="/"
                aria-label="Today's Carolinian home"
                onClick={() => setIsSheetOpen(false)}
              >
                <Image
                  src={TCRedLogo}
                  alt="Today's Carolinian logo"
                  width={56}
                  height={56}
                  className="mb-8 size-14 object-contain"
                />
              </Link>

              <nav aria-label="Mobile navigation">
                {allNavigation.map(renderMobileLink)}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            aria-label="Today's Carolinian home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src={TCRedLogo}
              alt="Today's Carolinian logo"
              width={42}
              height={42}
              priority
              className="size-10 object-contain"
            />
          </Link>

          {isAuthenticated ? (
            <UserAvatar
              onLogout={handleLogout}
              isPending={isLoggingOut}
            />
          ) : (
            <div className="size-10" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
}
