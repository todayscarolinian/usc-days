import { NextResponse } from "next/server";
import TeamService from "@/services/teams.service";
import { AddTeamPayload, EditTeamPayload } from "@/types/teams.types";

const teamService = new TeamService()

export async function GET() {
    const teams = await teamService.getTeams()
    return NextResponse.json({ teams, count: teams.length }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body: AddTeamPayload = await req.json();
        const newTeam = await teamService.addTeam(body);
        return NextResponse.json({ newTeam }, { status: 201 });
    } catch (error) {
        console.error('Error adding team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while adding the team.' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body: EditTeamPayload = await req.json();
        const updatedTeam = await teamService.editTeam(body);
        return NextResponse.json({ updatedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while updating the team.' }, { status: 500 });
    }
}
