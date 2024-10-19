import GameService from "@/services/games.service";
import { AddGameSchema, EditGameSchema, DeleteGameSchema } from "@/types/games.types";
import { NextResponse } from "next/server";

const gameService = new GameService
export async function GET() {
    const games = await gameService.getGames()
    return NextResponse.json({ games, count: games.length }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddGameSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const newGame = await gameService.addGame(validatedBody);
        return NextResponse.json({ newGame }, { status: 201 });
    } catch (error) {
        console.error('Error adding game:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditGameSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedGame = await gameService.editGame(validatedBody);
        return NextResponse.json({ updatedGame }, { status: 200 });
    } catch (error) {
        console.error('Error updating game:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteGameSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedGame = await gameService.deleteGame(validatedBody);
        return NextResponse.json({ deletedGame }, { status: 200 });
    } catch (error) {
        console.error('Error deleting game:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the game.' }, { status: 500 });
    }
}
