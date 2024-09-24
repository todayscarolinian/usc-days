import GameService from "@/services/games.service";
import { NextResponse } from "next/server";

const gameService = new GameService
export async function GET() {
    const games = await gameService.getGames() 
    return NextResponse.json({ games, count: games.length }, { status: 200 });
}
