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

// Full replacement: id comes from the URL, every other field is required.
const ReplaceChampionBodySchema = EditChampionSchema.omit({ id: true });

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    const champion = await championService.getChampionById(id.data);
    return NextResponse.json(champion);
  } catch (error) {
    return handleRouteError(error, "Could not fetch champion.");
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, ReplaceChampionBodySchema);
  if (!body.ok) return body.response;

  try {
    const champion = await championService.editChampion(id.data, body.data);
    return NextResponse.json(champion);
  } catch (error) {
    return handleRouteError(error, "Could not update champion.");
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    await championService.deleteChampion(id.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Could not delete champion.");
  }
}