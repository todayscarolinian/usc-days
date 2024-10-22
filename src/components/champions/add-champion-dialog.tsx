"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { games, teams } from "@/constants/mockData";

export default function AddChampionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-tc_primary-500 hover:bg-tc_primary-600">
          Add Champion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Champion</DialogTitle>
          <DialogDescription>
            Add a new champion of a game. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="w-full">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a Game" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {games.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 p-4 border-2 rounded-md relative">
            <p className="absolute top-[-10px] bg-[#f9f9f9] text-[#2D2A29] text-sm">
              Add Winners
            </p>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Champion" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                    {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                            {team}
                        </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select First Runner Up" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                    {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                            {team}
                        </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Second Runner Up" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                    {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                            {team}
                        </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
