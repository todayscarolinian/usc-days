import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ChampionService from "@/src/services/champions.service";
import { AddChampionSchema } from "@/src/types/champions.types";
import {
  requireHeraldAccess,
  isAccessError,
} from "@/src/lib/herald/require-access";
import {
  accessErrorResponse,
  endOfDayQuery,
  handleRouteError,
  idQuery,
  parseJsonBody,
  parseQuery,
  startOfDayQuery,
} from "@/src/lib/api";

const championService = new ChampionService();

const GetChampionsQuerySchema = z.object({
  teamId: idQuery,
  gameTypeId: idQuery,
  rank: idQuery,
  startDate: startOfDayQuery,
  endDate: endOfDayQuery,
});

export async function GET(req: NextRequest) {
  const query = parseQuery(req.nextUrl.searchParams, GetChampionsQuerySchema);
  if (!query.ok) return query.response;

  try {
    const data = await championService.getChampions(query.data);
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, "Could not fetch champions.");
  }
}

export async function POST(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const body = await parseJsonBody(req, AddChampionSchema);
  if (!body.ok) return body.response;

  try {
    const champion = await championService.addChampion(body.data);
    return NextResponse.json(champion, {
      status: 201,
      headers: { Location: `/api/champions/${champion.id}` },
    });
  } catch (error) {
    return handleRouteError(error, "Could not create champion.");
  }
}