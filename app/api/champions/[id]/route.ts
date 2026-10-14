import { NextRequest, NextResponse } from "next/server";
import ChampionService from "@/src/services/champions.service";
import { EditChampionSchema } from "@/src/types/champions.types";
import {
  requireHeraldAccess,
  isAccessError,
} from "@/src/lib/herald/require-access";
import {
  accessErrorResponse,
  handleRouteError,
  parseIdParam,
  parseJsonBody,
} from "@/src/lib/api";

const championService = new ChampionService();

const ReplaceChampionBodySchema = EditChampionSchema.omit({ id: true });

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const id = parseIdParam((await params).id);
    const champion = await championService.getChampionById(id);
    return NextResponse.json(champion, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  try {
    const id = parseIdParam((await params).id);
    const body = await parseJsonBody(req, ReplaceChampionBodySchema);
    const champion = await championService.editChampion(id, body);
    return NextResponse.json(champion, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  try {
    const id = parseIdParam((await params).id);
    await championService.deleteChampion(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}