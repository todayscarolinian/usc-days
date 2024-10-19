import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Menu } from "lucide-react";
import Image from "next/image";

const nav_items = [
  {
    href: "/",
    name: "Scores",
  },
  {
    href: "#",
    name: "Schedules",
  },
  {
    href: "/rankings",
    name: "Rankings",
  },
  {
    href: "/champions",
    name: "Champions",
  },
];

export default function Navbar() {
  return (
    <div>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-tc_primary">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Image src="/tc-logo-red.png" alt="tc-logo" width={50} height={50} />
          {nav_items.map((n) => (
            <Button key={n.name} className="bg-tc_primary shadow-none" asChild>
              <Link
                href={n.href}
                className="text-white transition-colors hover:text-white"
              >
                {n.name}
              </Link>
            </Button>
          ))}
        </nav>
        <Sheet>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
