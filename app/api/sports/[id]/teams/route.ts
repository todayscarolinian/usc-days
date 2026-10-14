import { NextResponse } from "next/server";
import GameTypeService from "@/src/services/gametypes.service";
import { getSportsTeamData } from "@/src/lib/actions";
import { handleRouteError, parseIdParam } from "@/src/lib/api";


const gameTypeService = new GameTypeService();

export async function GET(
    req: Request,
    { params }: { params: Promise<{id: string}> }
) {
    const id = parseIdParam((await params).id);
    if(!id.ok) return id.response;

    try {
        await gameTypeService.getGameTypeById(id.data);
        const teams = await getSportsTeamData(id.data);
        return NextResponse.json({ data: teams});
    } catch (error) {
        return handleRouteError(error, "Could not fetch sport teams.");
    }
}