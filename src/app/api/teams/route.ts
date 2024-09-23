import { NextResponse } from "next/server";
import TeamService from "@/services/teams.service";

const teamService = new TeamService()

export async function GET() {
    const teams = await teamService.getTeams()
    return NextResponse.json({ teams, count: teams.length }, { status: 200 });
}
