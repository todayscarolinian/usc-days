import { NextResponse } from "next/server";
import { updateSets } from "@/src/services/set-scoring.service";
import { SetActionSchema } from "@/src/types/games.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseIdParam, parseJsonBody } from "@/src/lib/api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);
  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;
  const body = await parseJsonBody(req, SetActionSchema);
  if (!body.ok) return body.response;
  try {
    return NextResponse.json(await updateSets(id.data, body.data));
  } catch (error) {
    return handleRouteError(error, "Could not update set scores.");
  }
}
