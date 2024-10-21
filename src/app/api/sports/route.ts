import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sports = await prisma.gameType.findMany();
        return NextResponse.json({ sports, count: sports.length }, { status: 200 });
    } catch (error) {
        console.error('Error fetching sports:', error);
        throw new Error('Could not fetch sports');
    }
}