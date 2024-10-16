import GameService from "@/services/games.service";
import { EditGamePayload, AddGamePayload } from "@/types/games.types";
import { NextResponse } from "next/server";

const gameService = new GameService
export async function GET() {
    const games = await gameService.getGames()
    return NextResponse.json({ games, count: games.length }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body: AddGamePayload = await req.json();
        if (body.teamAId === body.teamBId) {
            throw new Error('Team A and Team B cannot be the same.')
        }
        const newGame = await gameService.addGame(body);
        return NextResponse.json({ newGame }, { status: 201 });
    } catch (error) {
        console.error('Error adding game:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body: EditGamePayload = await req.json();
        if (body.teamAId === body.teamBId) {
            throw new Error('Team A and Team B cannot be the same.')
        }
        const updatedGame = await gameService.editGame(body);
        return NextResponse.json({ updatedGame }, { status: 200 });
    } catch (error) {
        console.error('Error updating game:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json(); // Get the id from the request body
        const deletedGame = await gameService.deleteGame(id);
        return NextResponse.json({ deletedGame }, { status: 200 });
    } catch (error) {
        console.error('Error deleting game:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the game.' }, { status: 500 });
    }
}
