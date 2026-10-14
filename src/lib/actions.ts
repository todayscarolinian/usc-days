"use server";

import { prisma } from "./prisma";

export async function getSportsTeamData(sportId: number) {
    return prisma.teamGameType.findMany({
        where: { gameTypeId: sportId },
        include: {
            team: {
                select: { teamName: true },
            },
        },
    });
}