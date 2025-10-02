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

import { format } from "date-fns";
import { Schedules } from "@/types/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddScorePayload } from "@/types/scores.types";
import { useInitializeUserStore, useUserStore } from "@/stores/user-store";
import axios from "axios";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ScoreInputs {
  teamA: {
    teamId: number;
    score: number;
  };
  teamB: {
    teamId: number;
    score: number;
  };
}

export default function AddScoreDialog({
  schedules,
}: {
  schedules: Schedules[];
}) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedules | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [scoreInputs, setScoreInputs] = useState<ScoreInputs>({
    teamA: { teamId: 0, score: 0 },
    teamB: { teamId: 0, score: 0 },
  });

  useInitializeUserStore();
  const user = useUserStore();

  async function createScore() {
    try {
      setLoading(true);
      const {
        data: { userId },
      } = await axios.get(`/api/user/services`, {
        params: {
          email: user.email,
        },
      });

      if (!selectedSchedule || !userId) return;
      const data: AddScorePayload = {
        gameId: selectedSchedule?.id,
        teamAScore: scoreInputs.teamA.score,
        teamBScore: scoreInputs.teamB.score,
        createdById: userId,
      };

      const newScore = await axios.post(`/api/scores`, data);

      setLoading(false);
      if (newScore.status != 200) {
        setError("An error occurred");
        console.log(newScore.data.error);
      } else window.location.reload();
    } catch (error) {
      setLoading(false);
      setError("An error occurred.");
      console.log(error);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedSchedule(null);
          setScoreInputs({
            teamA: { teamId: 0, score: 0 },
            teamB: { teamId: 0, score: 0 },
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-tc_primary-500 hover:bg-tc_primary-600">
          Add Score
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Score</DialogTitle>
          <DialogDescription>
            Add a new score for a schedule. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          {/* ✅ Searchable Schedule Selector */}
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={schedules.length === 0}
                >
                  {selectedSchedule
                    ? `${format(
                        new Date(selectedSchedule.startDate),
                        "MMMM d h:mm a"
                      )} - ${selectedSchedule.teamA.teamName} vs ${
                        selectedSchedule.teamB.teamName
                      } (${selectedSchedule.gameType.gameName})`
                    : "Select a Game"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search schedule..." />
                  <CommandList>
                    <CommandEmpty>No schedule found.</CommandEmpty>
                    <CommandGroup>
                      {schedules.map((sched, ndx) => (
                        <CommandItem
                          key={sched.id}
                          value={ndx.toString()}
                          onSelect={() => setSelectedSchedule(schedules[ndx])}
                        >
                          {format(new Date(sched.startDate), "MMMM d h:mm a")} -{" "}
                          {sched.teamA.teamName} <span className="opacity-50">vs</span>{" "}
                          {sched.teamB.teamName} ({sched.gameType.gameName})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* ✅ Team A Score Input */}
          <div className="relative flex flex-col gap-4 p-4 border-2 rounded-md md:flex-row sm:gap-10">
            <p className="absolute top-[-12px] bg-[#f9f9f9] text-[#2D2A29]">
              Set{" "}
              {selectedSchedule
                ? selectedSchedule.teamA.teamName
                : "Team 1"}{" "}
              Score
            </p>
            <div className="w-56 md:w-64">
              <Input
                type="number"
                name="teamAScore"
                value={scoreInputs.teamA.score}
                onChange={(e) =>
                  setScoreInputs((prev) => ({
                    ...prev,
                    teamA: {
                      ...prev.teamA,
                      score: Number(e.target.value),
                    },
                  }))
                }
                disabled={selectedSchedule === null}
              />
            </div>
          </div>

          {/* ✅ Team B Score Input */}
          <div className="relative flex flex-col gap-4 p-4 border-2 rounded-md md:flex-row sm:gap-10">
            <p className="absolute top-[-12px] bg-[#f9f9f9] text-[#2D2A29]">
              Set{" "}
              {selectedSchedule
                ? selectedSchedule.teamB.teamName
                : "Team 2"}{" "}
              Score
            </p>
            <div className="w-56 md:w-64">
              <Input
                type="number"
                name="teamBScore"
                value={scoreInputs.teamB.score}
                onChange={(e) =>
                  setScoreInputs((prev) => ({
                    ...prev,
                    teamB: {
                      ...prev.teamB,
                      score: Number(e.target.value),
                    },
                  }))
                }
                disabled={selectedSchedule === null}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center">
          {error && <span className="text-red-500">{error}</span>}
          <Button
            type="submit"
            onClick={async () => {
              await createScore();
            }}
            disabled={selectedSchedule === null || loading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
