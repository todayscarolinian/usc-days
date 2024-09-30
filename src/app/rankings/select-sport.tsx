"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Games } from "@/types/games.types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectSportButtonProps {
  onSelectSport: (sport: string) => void; 
}

export function SelectSportButton({ onSelectSport }: SelectSportButtonProps) {
  const [selection, setSelection] = useState<Games>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // mock data
    setSelection({
      games: ["Soccer", "Basketball", "Baseball"], 
      count: 3,
    });
    setLoading(false);
  }, []);

  const handleSportSelect = (sport: string) => {
    onSelectSport(sport); 
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Select onValueChange={handleSportSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a game" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selection?.games.map((sport) => (
            <SelectItem key={sport} value={sport}>
              {sport}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
