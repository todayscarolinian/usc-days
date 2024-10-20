"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SelectSportButtonProps {
  onSelectSport: (sport: string) => void;
}

export function SelectSportButton({ onSelectSport }: SelectSportButtonProps) {
  const [games, setGames] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData = {
      games: ["Soccer", "Basketball", "Baseball"],
      count: 3,
    };
    setGames(mockData.games);
    setLoading(false);
  }, []);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
    onSelectSport(game);
    setOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedGame || "Select sport..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sport..." />
          <CommandList>
            <CommandEmpty>No sport found.</CommandEmpty>
            <CommandGroup>
              {games.map((game) => (
                <CommandItem
                  key={game}
                  value={game}
                  onSelect={() => handleGameSelect(game)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedGame === game ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {game}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
