import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateMeta } from "@/src/lib/metadata";
import { ApiError } from "@/src/lib/api";
import { getGameStatus } from "@/src/lib/game-status";
import { SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";
import { isMultiTeam, ordinal, sortedParticipants } from "@/src/lib/multi-team";
import GameService from "@/src/services/games.service";
import GamePage from "@/src/components/schedules/game-page";

type PageProps = { params: Promise<{ gameId: string }> };

const gameService = new GameService();

const whenFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
});

function parseGameId(raw: string) {
  const gameId = Number(raw);
  return Number.isInteger(gameId) && gameId > 0 ? gameId : null;
}

type Game = Awaited<ReturnType<GameService["getGameById"]>>;

/** The score line people see in link previews, e.g. "Finished: SAS 9 – 0 SAFAD. SAS wins." */
function describeResult(game: Game) {
  const teamA = game.teamA?.teamName ?? "TBD";
  const teamB = game.teamB?.teamName ?? "TBD";
  const score = `${teamA} ${Number(game.teamAScore ?? 0)} – ${Number(game.teamBScore ?? 0)} ${teamB}`;

  switch (getGameStatus(game, new Date())) {
    case "finished": {
      if (game.teamAForfeited && game.teamBForfeited) return "Both teams forfeited.";
      if (game.teamAForfeited || game.teamBForfeited) {
        return `${game.teamAForfeited ? teamA : teamB} forfeited. ${game.winner?.teamName ?? ""} wins.`.trim();
      }
      const outcome = game.isDraw ? "Draw." : game.winner ? `${game.winner.teamName} wins.` : "";
      return `Finished: ${score}. ${outcome}`.trim();
    }
    case "live":
      return game.teamAScore != null || game.teamBScore != null ? `Live: ${score}.` : "Live now.";
    case "awaiting":
      return `${score}, awaiting the official result.`;
    default:
      return null;
  }
}

/** The podium line for a multi-team game, e.g. "Finished: 1st Yu, Ashley (SAFAD), 2nd SOE & SBE." */
function describeMultiTeamResult(game: Game) {
  switch (getGameStatus(game, new Date())) {
    case "finished": {
      const places = new Map<number, string[]>();
      for (const { rank, name, team } of sortedParticipants(game)) {
        if (rank == null || rank > 3) continue;
        places.set(rank, [...(places.get(rank) ?? []), name != null ? `${name} (${team.teamName})` : team.teamName]);
      }
      // Two unnamed entries of one team tied on a place name the team once.
      const podium = [...places].map(([rank, teams]) => `${ordinal(rank)} ${[...new Set(teams)].join(" & ")}`);
      return podium.length > 0 ? `Finished: ${podium.join(", ")}.` : "Finished.";
    }
    case "live":
      return "Live now.";
    default:
      return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const gameId = parseGameId((await params).gameId);
  if (gameId === null) notFound();

  let game: Game;
  try {
    game = await gameService.getGameById(gameId);
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOT_FOUND") notFound();
    // Metadata should never take the page down; fall back to a generic description.
    return generateMeta({
      title: "Game Details - USC Days 2026",
      description: "Scores and details for a USC Days 2026 game.",
      url: `/schedules/${gameId}`,
      image: "/og_image.jpg",
    });
  }

  const sport = game.gameType.gameName;
  const multiTeam = isMultiTeam(game);
  const venue = game.location?.trim();
  const when = `${whenFormatter.format(game.startDate)}${venue ? ` at ${venue}` : ""}.`;
  const result = multiTeam ? describeMultiTeamResult(game) : describeResult(game);
  // A multi-team game has no matchup to lead with, so the event name is the title.
  const title = multiTeam
    ? sport
    : `${game.teamA?.teamName ?? "TBD"} vs ${game.teamB?.teamName ?? "TBD"} - ${sport}`;

  return generateMeta({
    title: `${title} | USC Days 2026`,
    description: [`${sport}, ${when}`, result].filter(Boolean).join(" "),
    url: `/schedules/${gameId}`,
    image: "/og_image.jpg",
  });
}

export default async function GamePageRoute({ params }: PageProps) {
  const gameId = parseGameId((await params).gameId);
  if (gameId === null) notFound();

  return <GamePage gameId={gameId} />;
}
