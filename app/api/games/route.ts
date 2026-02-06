import GameService, { GetGamesWithPaginationParams } from "@/src/services/games.service";
import {
    AddGameSchema,
    EditGameSchema,
    DeleteGameSchema,
} from "@/src/types/games.types";
import { NextRequest, NextResponse } from "next/server";

const gameService = new GameService();
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const params: GetGamesWithPaginationParams = {};

        const gameTypeId = searchParams.get("gameTypeId");
        if (gameTypeId) {
            const parsed = parseInt(gameTypeId, 10);
            if (!isNaN(parsed)) params.gameTypeId = parsed;
        }

        const teamAId = searchParams.get("teamAId");
        if (teamAId) {
            const parsed = parseInt(teamAId, 10);
            if (!isNaN(parsed)) params.teamAId = parsed;
        }

        const teamBId = searchParams.get("teamBId");
        if (teamBId) {
            const parsed = parseInt(teamBId, 10);
            if (!isNaN(parsed)) params.teamBId = parsed;
        }

        const teamId = searchParams.get("teamId");
        if (teamId) {
            const parsed = parseInt(teamId, 10);
            if (!isNaN(parsed)) params.teamId = parsed;
        }

        const winnerId = searchParams.get("winnerId");
        if (winnerId) {
            const parsed = parseInt(winnerId, 10);
            if (!isNaN(parsed)) params.winnerId = parsed;
        }

        const createdById = searchParams.get("createdById");
        if (createdById) {
            const parsed = parseInt(createdById, 10);
            if (!isNaN(parsed)) params.createdById = parsed;
        }

        const location = searchParams.get("location");
        if (location) {
            params.location = location;
        }

        const hasWinner = searchParams.get("hasWinner");
        if (hasWinner !== null) {
            params.hasWinner = hasWinner === "true";
        }

        const startDate = searchParams.get("startDate");
        if (startDate) {
            // Parse as local date at start of day (00:00:00)
            const [year, month, day] = startDate.split('-').map(Number);
            const parsed = new Date(year, month - 1, day, 0, 0, 0, 0);
            if (!isNaN(parsed.getTime())) params.startDate = parsed;
        }

        const endDate = searchParams.get("endDate");
        if (endDate) {
            // Parse as local date at end of day (23:59:59.999)
            const [year, month, day] = endDate.split('-').map(Number);
            const parsed = new Date(year, month - 1, day, 23, 59, 59, 999);
            if (!isNaN(parsed.getTime())) params.endDate = parsed;
        }

        const cursor = searchParams.get("cursor");
        if (cursor) {
            if (!isNaN(Date.parse(cursor))) {
                params.cursor = cursor;
            }
        }

        const limit = searchParams.get("limit");
        if (limit) {
            const parsed = parseInt(limit, 10);
            if (!isNaN(parsed) && parsed > 0) {
                params.limit = Math.min(parsed, 100);
            }
        }

        const result = await gameService.getGames(params);

        if (Array.isArray(result)) {
            return NextResponse.json(
                { games: result, count: result.length },
                { status: 200 }
            );
        } else {
            return NextResponse.json(result, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching games:", error);
        return NextResponse.json(
            { error: "Could not fetch games" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddGameSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const newGame = await gameService.addGame(validatedBody);
        return NextResponse.json({ newGame }, { status: 201 });
    } catch (error) {
        console.error("Error adding game:", error);
        // Check if it's a conflict error (duplicate schedule or location)
        if (error instanceof Error && (error.message.includes("already exists") || error.message.includes("already booked"))) {
            return NextResponse.json(
                { message: error.message },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Could not add game" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditGameSchema.safeParse(body);

        if (!result.success) {
            console.log("Error validating edit game data:", result.error);
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedGame = await gameService.editGame(validatedBody);
        return NextResponse.json({ updatedGame }, { status: 200 });
    } catch (error) {
        console.error("Error updating game:", error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteGameSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedGame = await gameService.deleteGame(validatedBody);
        return NextResponse.json({ deletedGame }, { status: 200 });
    } catch (error) {
        console.error("Error deleting game:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while deleting the game." },
            { status: 500 }
        );
    }
}
