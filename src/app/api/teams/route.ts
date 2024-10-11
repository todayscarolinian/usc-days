import { NextResponse } from "next/server";
import TeamService from "@/services/teams.service";
import { AddTeamSchema, DeleteTeamSchema, EditTeamSchema } from "@/types/teams.types";

const teamService = new TeamService()

export async function GET() {
    const teams = await teamService.getTeams()
    return NextResponse.json({ teams, count: teams.length }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;

        const newTeam = await teamService.addTeam(validatedBody);
        return NextResponse.json({ newTeam }, { status: 201 });
    } catch (error) {
        console.error('Error adding team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while adding the team.' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedTeam = await teamService.editTeam(validatedBody);
        return NextResponse.json({ updatedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while updating the team.' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteTeamSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedTeam = await teamService.deleteTeam(validatedBody.id);
        return NextResponse.json({ deletedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the team.' }, { status: 500 });
    }
}
