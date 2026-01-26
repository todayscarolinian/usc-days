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
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

export default function Navbar() {
  useInitializeUserStore();
  const { email, resetUser } = useUserStore();
  const { mutate: signOut, isPending } = useSignOut();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();

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

  const handleLogout = () => {};

  return (
    <header
      className={`fixed w-full top-0 z-50 flex h-16 items-center gap-4 px-4 md:px-6 transition-all duration-500 ${isScrolled || pathName !== "/" ? "bg-tc_primary" : "bg-tc_primary md:bg-transparent"}`}
    >
      <nav className="hidden text-lg font-medium md:flex md:flex-row md:items-center md:justify-between w-full">
        <Image src="/tc-logo-red.png" alt="tc-logo" width={50} height={50} />
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
                    href={n.href}
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
                  href={n.href}
                  className="text-white transition-colors hover:text-white"
                >
                  {n.name}
                </Link>
              </Button>
            ),
          )}
        </div>
      </nav>
      <Sheet defaultOpen={false}>
        <SheetTrigger asChild>
          <Button size="icon" className="shrink-0 bg-tc_primary-600 md:hidden">
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-tc_primary">
          <nav className="grid gap-6 text-lg font-medium">
            <Image
              src="/tc-logo-white.png"
              alt="tc-logo"
              width={50}
              height={50}
            />
            {nav_items.map((i) => (
              <Link key={i.href} href={i.href} className="text-white">
                {i.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      {email ? (
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </header>
  );
}
