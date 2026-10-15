import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import GameService from "@/src/services/games.service";
import { AddGameSchema } from "@/src/types/games.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import {
    accessErrorResponse,
    boolQuery,
    endOfDayQuery,
    handleRouteError,
    idListQuery,
    idQuery,
    limitQuery,
    parseJsonBody,
    parseQuery,
    startOfDayQuery,
    stringQuery,
} from "@/src/lib/api";
import { decodeGamesCursor } from "@/src/lib/games-cursor";

const gameService = new GameService();

const GetGamesQuerySchema = z.object({
    gameTypeId: idQuery,
    gameTypeIds: idListQuery,
    teamAId: idQuery,
    teamBId: idQuery,
    teamId: idQuery,
    winnerId: idQuery,
    createdByHeraldId: stringQuery,
    location: stringQuery,
    hasWinner: boolQuery,
    startDate: startOfDayQuery,
    endDate: endOfDayQuery,
    // Filter on start time alone, so a game belongs to exactly one day.
    startsFrom: startOfDayQuery,
    startsBefore: startOfDayQuery,
    // `nextCursor` from the previous page
    cursor: z.string().refine((v) => decodeGamesCursor(v) !== null, "Invalid cursor.").optional(),
    limit: limitQuery(),
    order: z.enum(["asc", "desc"]).default("asc"),
});

export async function GET(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, GetGamesQuerySchema);
    if (!query.ok) return query.response;

    try {
        const games = await gameService.getGames(query.data);
        return NextResponse.json(games);
    } catch (error) {
        return handleRouteError(error, "Could not fetch games.");
    }
}

export async function POST(req: NextRequest) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) return accessErrorResponse(access);

    const body = await parseJsonBody(req, AddGameSchema);
    if (!body.ok) return body.response;

    try {
        const game = await gameService.addGame(body.data, access.user.id);
        return NextResponse.json(game, {
            status: 201,
            headers: { Location: `/api/games/${game.id}` },
        });
    } catch (error) {
        return handleRouteError(error, "Could not create game.");
    }
}
