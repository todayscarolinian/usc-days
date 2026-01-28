"use client";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { CircleUser, Menu } from "lucide-react";
import Image from "next/image";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import { useSignOut } from "@/src/queries/auth.queries";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const nav_items = [
  {
    href: "/",
    name: "Home",
    protected: false,
  },
  {
    href: "/schedules",
    name: "Schedules",
    protected: false,
  },
  {
    href: "/leaderboards",
    name: "Leaderboards",
    protected: false,
  },
  {
    href: "/standings",
    name: "Standings",
    protected: false,
  },
];

function UserAvatar({
  handleLogout,
  isPending,
}: {
  handleLogout: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div className="ml-auto flex-1 sm:flex-initial"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function Navbar() {
  useInitializeUserStore();
  const { email, resetUser } = useUserStore();
  const { mutate: signOut, isPending } = useSignOut();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // Preserve sport parameter across navigation
  const sportParam = searchParams.get("sport");
  const queryString = useMemo(() => {
    return sportParam ? `?sport=${sportParam}` : "";
  }, [sportParam]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathName]);

  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        resetUser();
      },
    });
  };

  return (
    <header
      className={`w-full top-0 z-50 flex h-16 items-center gap-4 px-4 md:px-6 transition-all duration-500 ${isScrolled || pathName !== "/" ? "bg-tc_primary sticky" : "fixed bg-tc_primary md:bg-transparent"}`}
    >
      {/* Desktop Nav */}
      <nav className="hidden text-lg font-medium md:flex md:flex-row md:items-center md:justify-between w-full">
        <Link href="/">
          <Image src="/tc-logo-red.png" alt="tc-logo" width={50} height={50} />
        </Link>
        <div className="flex items-center lg:gap-6">
          {nav_items.map((n) =>
            n.protected ? (
              email && (
                <Button
                  key={n.name}
                  className={`${isScrolled || pathName !== "/" ? "bg-tc_primary shadow-none" : "bg-transparent shadow-none"}`}
                  asChild
                >
                  <Link
                    href={`${n.href}${n.href === "/" ? "" : queryString}`}
                    className="text-white transition-colors hover:text-white"
                  >
                    {n.name}
                  </Link>
                </Button>
              )
            ) : (
              <Button
                key={n.name}
                className={`${pathName === "/" ? "bg-transparent shadow-none" : "bg-tc_primary shadow-none"}`}
                asChild
              >
                <Link
                  href={`${n.href}${n.href === "/" ? "" : queryString}`}
                  className="text-white transition-colors hover:text-white"
                >
                  {n.name}
                </Link>
              </Button>
            ),
          )}
          {email && (
            <UserAvatar handleLogout={handleLogout} isPending={isPending} />
          )}
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden flex w-full items-center justify-between">
        <Sheet defaultOpen={false}>
          <SheetTrigger asChild>
            <Button size="icon" className="shrink-0 bg-tc_primary-600">
              <Menu />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-tc_primary p-4">
            <nav className="grid gap-6 text-lg font-medium">
              <Image
                src="/tc-logo-white.png"
                alt="tc-logo"
                width={50}
                height={50}
              />
              {nav_items.map((i) => (
                <Link
                  key={i.href}
                  href={`${i.href}${i.href === "/" ? "" : queryString}`}
                  className="text-white"
                >
                  {i.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        {email && (
          <UserAvatar handleLogout={handleLogout} isPending={isPending} />
        )}
      </div>
    </header>
  );
}
