import { NextResponse } from "next/server";
import GameTypeService from "@/src/services/gametypes.service";
import { EditGameTypeSchema } from "@/src/types/gametypes.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import {
    accessErrorResponse, 
    handleRouteError,
    parseIdParam,
    parseJsonBody,
} from "@/src/lib/api";

const gameTypeService = new GameTypeService()

export async function GET(
    req: Request,
    { params }: {params: Promise<{id: string}> }
) {
    const id = parseIdParam((await params).id);
    if(!id.ok) return id.response;

    try {
        const sport = await gameTypeService.getGameTypeById(id.data);
        return NextResponse.json(sport);
    } catch (error) {
        return handleRouteError(error, "Could not fetch sport.");
    }
}

export async function PUT(
        req: Request,
    { params }: {params: Promise<{id: string}> }
) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) return accessErrorResponse(access);

    const id = parseIdParam((await params).id);
    if(!id.ok) return id.response;
    
    const body = await parseJsonBody(req, EditGameTypeSchema);
    if(!body.ok) return body.response;
    
    try {
        const sport = await gameTypeService.editGameType(id.data, body.data);
        return NextResponse.json(sport);
    } catch (error) {
        return handleRouteError(error, "Could not update sport.");
    }
}

export async function DELETE(
            req: Request,
    { params }: {params: Promise<{id: string}> }
) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) return accessErrorResponse(access);

    const id = parseIdParam((await params).id);
    if(!id.ok) return id.response;

    try {        
        await gameTypeService.deleteGameType(id.data);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return handleRouteError(error, "Could not delete sport.");
    }
}
