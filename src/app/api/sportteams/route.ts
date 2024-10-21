import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const sportId = url.searchParams.get("sport");

        const sportTeams = await prisma.teamGameType.findMany({
            where: {
                gameTypeId: Number(sportId),
            },
            include: {
                team: {
                    select: {
                        teamName: true,
                    }
                }
            }
        })
        return NextResponse.json({ sportTeams, count: sportTeams.length }, { status: 200 });
    } catch (error) {
        console.error('Error fetching sportTeams:', error);
        throw new Error('Could not fetch sportTeams');
    }
}