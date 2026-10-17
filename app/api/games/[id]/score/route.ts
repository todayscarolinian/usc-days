import { NextResponse } from "next/server";
import GameService from "@/src/services/games.service";
import { ScoreDeltaSchema } from "@/src/types/games.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseIdParam, parseJsonBody } from "@/src/lib/api";

const gameService = new GameService();

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, ScoreDeltaSchema);
  if (!body.ok) return body.response;

  try {
    const game = await gameService.updateScore(id.data, body.data);
    return NextResponse.json(game);
  } catch (error) {
    return handleRouteError(error, "Could not update score.");
  }
}
