"use server";

import { prisma } from "./prisma";

export async function getSportsTeamData(sportId: number) {
    try {
        const data = await prisma.teamGameType.findMany({
            where: {
                gameTypeId: sportId,
            },
            include: {
                team: {
                    select: {
                        teamName: true,
                    },
                },
            },
        });
        if(data) return data;
    } catch (error) {
        console.error("Error fetching sports data:", error);
    }
}