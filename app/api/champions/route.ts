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
  teamId: idQuery.optional(),
  gameTypeId: idQuery.optional(),
  rank: idQuery.optional(),
  startDate: startOfDayQuery.optional(),
  endDate: endOfDayQuery.optional(),
});

export async function GET(req: NextRequest) {
  try {
    const params = parseQuery(req.nextUrl.searchParams, GetChampionsQuerySchema);
    const data = await championService.getChampions(params);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  try {
    const body = await parseJsonBody(req, AddChampionSchema);
    const champion = await championService.addChampion(body);

    return NextResponse.json(champion, {
      status: 201,
      headers: { Location: `/api/champions/${champion.id}` },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}