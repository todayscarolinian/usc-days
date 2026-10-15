import { NextResponse } from "next/server";
import GameTypeService from "@/src/services/gametypes.service";
import { handleRouteError, parseIdParam } from "@/src/lib/api";


const gameTypeService = new GameTypeService();

export async function GET(
    req: Request,
    { params }: { params: Promise<{id: string}> }
) {
    const id = parseIdParam((await params).id);
    if(!id.ok) return id.response;

    try {
        const teams = await gameTypeService.getGameTypeTeams(id.data);
        return NextResponse.json({ data: teams});
    } catch (error) {
        return handleRouteError(error, "Could not fetch sport teams.");
    }
}