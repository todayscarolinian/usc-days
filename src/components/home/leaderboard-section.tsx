"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { transformSchoolsData } from "@/src/components/leaderboards/transformSchoolsData";
import StandingsTable from "@/src/components/standings/standings-table";
import StandingsTableSkeleton from "@/src/components/standings/standings-table-skeleton";
import { useGamesQuery } from "@/src/queries/games.queries";

export default function LeaderboardSection() {
  const { data: games = [], isLoading } = useGamesQuery();

  const standings = useMemo(
    () =>
      transformSchoolsData(games).map((school) => ({
        ...school,
        played: school.wins + school.losses + school.draws,
      })),
    [games],
  );

  return (
    <section
      id="leaderboard"
      aria-labelledby="leaderboard-heading"
      className="relative w-full overflow-hidden"
    >
      <Image
        src="/carousel/frisbee.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto grid max-w-7xl px-4 py-12 lg:grid-cols-[minmax(700px,3fr)_minmax(0,2fr)] lg:py-20">
        {isLoading ? (
          <StandingsTableSkeleton rows={7} />
        ) : (
          <StandingsTable data={standings} sportName="Leaderboards" />
        )}

        <div className="flex flex-col justify-end gap-8 bg-black/60 px-6 py-10 text-white md:px-10">
          <div className="space-y-2">
            <h2
              id="leaderboard-heading"
              className="text-3xl leading-none font-bold capitalize lg:text-5xl"
            >
              The Game Is On.
              <br />
              Bring The Heat!
            </h2>
            <p className="text-base leading-normal lg:text-lg">
              See who&apos;s leading the competition, track the latest
              standings, and find out who&apos;s climbing the ranks.
            </p>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex w-fit items-center gap-2 bg-tc_primary px-6 py-3 text-base font-medium uppercase transition-colors hover:bg-tc_primary-600"
          >
            Check Leaderboards
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
