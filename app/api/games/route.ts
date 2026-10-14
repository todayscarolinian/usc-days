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
    idQuery,
    limitQuery,
    parseJsonBody,
    parseQuery,
    startOfDayQuery,
    stringQuery,
} from "@/src/lib/api";

const gameService = new GameService();

const GetGamesQuerySchema = z.object({
    gameTypeId: idQuery,
    teamAId: idQuery,
    teamBId: idQuery,
    teamId: idQuery,
    winnerId: idQuery,
    createdByHeraldId: stringQuery,
    location: stringQuery,
    hasWinner: boolQuery,
    startDate: startOfDayQuery,
    endDate: endOfDayQuery,
    // ISO `startDate` of the last game on the previous page
    cursor: z.iso.datetime().optional(),
    limit: limitQuery(),
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
