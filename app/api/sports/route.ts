import { NextResponse } from "next/server";
import GameTypeService from "@/src/services/gametypes.service";
import { AddGameTypeSchema } from "@/src/types/gametypes.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseJsonBody } from "@/src/lib/api";

const gameTypeService = new GameTypeService()

export async function GET() {
    try {
        const sports = await gameTypeService.getGameTypes()
        return NextResponse.json({ data: sports});
    }
    catch (error) {
        return handleRouteError(error, "Could not fetch sports.");
    }
}

export async function POST(req: Request) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) return accessErrorResponse(access);
    
    const body = await parseJsonBody(req, AddGameTypeSchema);
    if(!body.ok) return body.response;

    try {
        const sport = await gameTypeService.addGameType(body.data);

        return NextResponse.json(sport, {
            status: 201,
            headers: {Location: `/api/sports/${sport.id}`},
        });
    } catch (error) {
        return handleRouteError(error, "Could not create sport.");
    }
}
