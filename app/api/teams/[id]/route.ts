import { NextResponse } from "next/server";
import { accessErrorResponse, handleRouteError, parseIdParam, parseJsonBody } from "@/src/lib/api";
import { isAccessError, requireHeraldAccess } from "@/src/lib/herald/require-access";
import TeamService from "@/src/services/teams.service";
import { EditTeamSchema } from "@/src/types/teams.types";

const teamService = new TeamService();

type TeamRouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: TeamRouteContext) {
  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    const team = await teamService.getTeam(id.data);
    return NextResponse.json(team);
  } catch (error) {
    return handleRouteError(error, "Could not fetch team.");
  }
}

export async function PUT(req: Request, { params }: TeamRouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, EditTeamSchema);
  if (!body.ok) return body.response;

  try {
    const team = await teamService.editTeam(id.data, body.data);
    return NextResponse.json(team);
  } catch (error) {
    return handleRouteError(error, "Could not update team.");
  }
}

export async function DELETE(req: Request, { params }: TeamRouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    await teamService.deleteTeam(id.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Could not delete team.");
  }
}
