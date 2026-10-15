"use client";

import type { Champions } from "@/src/types/types";
import Image from "next/image";

type TournamentPlacingsProps = {
  champions: Champions[];
  canEdit: boolean;
  loading?: boolean;
  onSelect: (rank: number) => void;
};

const placements = [
  {
    rank: 1,
    label: "Champion",
    medalSrc: "/medals/gold-medal.png",
  },
  {
    rank: 2,
    label: "First runner-up",
    medalSrc: "/medals/silver-medal.png",
  },
  {
    rank: 3,
    label: "Second runner-up",
    medalSrc: "/medals/bronze-medal.png",
  },
];

export default function TournamentPlacings({
  champions,
  canEdit,
  loading = false,
  onSelect,
}: TournamentPlacingsProps) {
  return (
    <div className="min-w-0 space-y-4">
      <section className="overflow-hidden bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat-y text-white">
        <header className="border-t-4 border-tc_primary px-4 py-3">
          <h2 className="text-sm font-bold uppercase">
            Tournament Placements
          </h2>
        </header>

        <div className="divide-y divide-white/10 px-4 pb-3">
          {placements.map((placement) => {
            const champion = champions.find(
              (item) => item.rank === placement.rank,
            );

            return (
              <button
                key={placement.rank}
                type="button"
                disabled={!canEdit}
                onClick={() => onSelect(placement.rank)}
                className="grid w-full grid-cols-[2rem_1.5rem_1fr] items-center gap-2 py-3 text-left disabled:cursor-default"
              >
                <span className="text-xs text-white/50">
                  {String(placement.rank).padStart(2, "0")}
                </span>

                {loading ? (
                    <span className="size-6 animate-pulse rounded-full bg-white/20" />
                ) : (
                    <Image
                        src={placement.medalSrc}
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 object-contain"
                    />
                )}

                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase">
                    {placement.label}
                  </span>

                  <span className="block truncate text-xs text-white/55">
                    {loading
                      ? "Loading..."
                      : champion?.team.teamName || "TBD"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border border-neutral-300 bg-white p-4">
        <dl className="grid grid-cols-[3rem_1fr] gap-x-3 gap-y-2 text-xs">
          <dt className="font-bold">W</dt>
          <dd className="text-neutral-500">Games won</dd>

          <dt className="font-bold">L</dt>
          <dd className="text-neutral-500">Games lost</dd>

          <dt className="font-bold">Win %</dt>
          <dd className="text-neutral-500">
            Wins divided by games played
          </dd>
        </dl>
      </section>

      {canEdit && (
        <p className="text-xs text-neutral-500">
          Select a placement to add or edit its assigned team.
        </p>
      )}
    </div>
  );
}