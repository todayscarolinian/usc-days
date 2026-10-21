"use client";

import Image from "next/image";

import { getLogoForSchool } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

import type { Champions } from "@/src/types/types";

type TournamentPlacingsProps = {
  champions: Champions[];
  canEdit: boolean;
  loading?: boolean;
  onSelect: (rank: number) => void;
};

const placements = [
  {
    rank: 2,
    label: "First runner-up",
  },
  {
    rank: 1,
    label: "Champion",
  },
  {
    rank: 3,
    label: "Second runner-up",
  },
] as const;

export default function TournamentPlacings({
  champions,
  canEdit,
  loading = false,
  onSelect,
}: TournamentPlacingsProps) {
  return (
    <section
      aria-labelledby="tournament-podium-heading"
      aria-busy={loading}
      className="min-w-0"
    >

      {loading && (
        <span role="status" className="sr-only">
          Loading tournament placements
        </span>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-3 items-end gap-1.5 sm:gap-4 lg:gap-3">
        {placements.map((placement) => {
          const champion = champions.find(
            (item) => item.rank === placement.rank,
          );

          const isChampion = placement.rank === 1;
          const teamName = champion?.team.teamName ?? "TBD";

          return (
            <button
              key={placement.rank}
              type="button"
              disabled={!canEdit || loading}
              onClick={() => onSelect(placement.rank)}
              aria-label={
                loading
                  ? `Loading ${placement.label}`
                  : canEdit
                    ? `${champion ? "Edit" : "Add"} ${placement.label}: ${teamName}`
                    : `${placement.label}: ${teamName}`
              }
              className={cn(
                "group flex min-w-0 w-full flex-col overflow-hidden border text-center shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tc_primary focus-visible:ring-offset-2 disabled:cursor-default",
                isChampion
                  ? "z-10 border-neutral-800 border-t-4 border-t-tc_primary bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat-y text-white"
                  : "border-neutral-300 bg-white bg-[url('/white-bg.png')] bg-top bg-repeat",
                canEdit &&
                  !loading &&
                  "cursor-pointer motion-safe:hover:-translate-y-1 motion-reduce:transform-none",
              )}
            >
              <span
                className={cn(
                  "flex w-full flex-col items-center justify-center px-1.5 py-3 sm:px-4 sm:py-5",
                  isChampion
                    ? "min-h-52 sm:min-h-64"
                    : "min-h-44 sm:min-h-56",
                )}
              >

                <span className="flex min-h-12 items-center justify-center sm:min-h-20">
                  {loading ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "animate-pulse rounded-full",
                        isChampion
                          ? "size-12 bg-white/20 sm:size-20"
                          : "size-10 bg-neutral-200 sm:size-16",
                      )}
                    />
                  ) : champion ? (
                    <Image
                      src={getLogoForSchool(champion.team.teamName)}
                      alt=""
                      aria-hidden="true"
                      className={cn(
                        "object-contain",
                        isChampion
                          ? "size-12 sm:size-20"
                          : "size-10 sm:size-16",
                      )}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex items-center justify-center rounded-full border text-lg font-bold",
                        isChampion
                          ? "size-12 border-white/30 text-white/50 sm:size-20"
                          : "size-10 border-neutral-300 text-neutral-400 sm:size-16",
                      )}
                    >
                      ?
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    "mt-3 text-[10px] font-extrabold uppercase tracking-wide sm:text-sm lg:text-base",
                    isChampion ? "text-amber-300" : "text-neutral-500",
                  )}
                >
                  {placement.label}
                </span>

                <span
                  className={cn(
                    "mt-1 min-h-10 max-w-full break-words px-1 text-sm font-black uppercase leading-tight sm:min-h-12 sm:text-xl lg:text-2xl",
                    isChampion ? "text-white" : "text-neutral-950",
                  )}
                >
                  {loading ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mx-auto mt-1 block h-3 w-12 animate-pulse rounded sm:w-20",
                        isChampion ? "bg-white/20" : "bg-neutral-200",
                      )}
                    />
                  ) : (
                    teamName
                  )}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "flex w-full items-center justify-center border-t text-3xl font-black tabular-nums sm:text-5xl lg:text-5xl",
                  isChampion &&
                    "h-24 border-white/10 bg-black/35 text-amber-300 sm:h-36",
                  placement.rank === 2 &&
                    "h-16 border-neutral-300 bg-neutral-200/80 text-neutral-600 sm:h-24",
                  placement.rank === 3 &&
                    "h-12 border-neutral-300 bg-amber-900/10 text-amber-800 sm:h-20",
                )}
              >
                {String(placement.rank).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {canEdit && (
        <p className="mt-4 text-center text-xs text-neutral-500">
          Select a podium placement to add or edit its assigned team.
        </p>
      )}
    </section>
  );
}