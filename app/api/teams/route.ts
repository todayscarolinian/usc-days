import { NextRequest, NextResponse } from "next/server";
import TeamService from "@/src/services/teams.service";
import { AddTeamSchema } from "@/src/types/teams.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseJsonBody } from "@/src/lib/api";

const teamService = new TeamService();

export async function GET() {
    try {
        const teams = await teamService.getTeams();
        return NextResponse.json({ data: teams });
    } catch (error) {
        return handleRouteError(error, "Could not fetch teams.");
    }
}

export async function POST(req: NextRequest) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) return accessErrorResponse(access);

    const body = await parseJsonBody(req, AddTeamSchema);
    if (!body.ok) return body.response;

    try {
        const team = await teamService.addTeam(body.data);
        return NextResponse.json(team, {
            status: 201,
            headers: { Location: `/api/teams/${team.id}` },
        });
    } catch (error) {
        return handleRouteError(error, "Could not create team.");
    }
}
