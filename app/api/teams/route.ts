import { NextRequest, NextResponse } from "next/server";
import TeamService from "@/src/services/teams.service";
import { AddTeamSchema, DeleteTeamSchema, EditTeamSchema } from "@/src/types/teams.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";

const teamService = new TeamService()

function accessErrorResponse(error: "UNAUTHENTICATED" | "FORBIDDEN" | "SERVICE_ERROR", message: string) {
    return NextResponse.json(
        { error: message },
        { status: error === "UNAUTHENTICATED" ? 401 : error === "FORBIDDEN" ? 403 : 502 }
    );
}

export async function GET() {
    try {
        const teams = await teamService.getTeams()
        return NextResponse.json({ teams, count: teams.length }, { status: 200 });
    }
    catch (error) {
        console.error("Error in fetching teams: ", error);
        return NextResponse.json({ error: "An unexpected error occurred while fetching teams." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) {
        return accessErrorResponse(access.error, access.message);
    }

    try {
        const body = await req.json();
        const result = AddTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;

        const newTeam = await teamService.addTeam(validatedBody);
        return NextResponse.json({ newTeam }, { status: 201 });
    } catch (error) {
        console.error('Error adding team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while adding the team.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) {
        return accessErrorResponse(access.error, access.message);
    }

    try {
        const body = await req.json();
        const result = EditTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedTeam = await teamService.editTeam(validatedBody);
        return NextResponse.json({ updatedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while updating the team.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const access = await requireHeraldAccess(req.headers.get("cookie"));
    if (isAccessError(access)) {
        return accessErrorResponse(access.error, access.message);
    }

    try {
        const body = await req.json();
        const result = DeleteTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedTeam = await teamService.deleteTeam(validatedBody);
        return NextResponse.json({ deletedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the team.' }, { status: 500 });
    }
}
