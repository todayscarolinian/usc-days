import { NextResponse } from "next/server";
import GameService from "@/src/services/games.service";
import { EditGameSchema } from "@/src/types/games.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseIdParam, parseJsonBody } from "@/src/lib/api";

const gameService = new GameService();

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    const game = await gameService.getGameById(id.data);
    return NextResponse.json(game);
  } catch (error) {
    return handleRouteError(error, "Could not fetch game.");
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, EditGameSchema);
  if (!body.ok) return body.response;

  try {
    const game = await gameService.editGame(id.data, body.data);
    return NextResponse.json(game);
  } catch (error) {
    return handleRouteError(error, "Could not update game.");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    await gameService.deleteGame(id.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Could not delete game.");
  }
}
