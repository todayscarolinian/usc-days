import { getSportsTeamData } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sportId = searchParams.get("sportId");
        if (!sportId) {
            return NextResponse.json(
                { error: "Missing sportId parameter" },
                { status: 400 }
            );
        }

        const teamgametypes = await getSportsTeamData(Number(sportId));

        return NextResponse.json({ teamgametypes }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching team game types: ", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while fetching team game types.",
            },
            { status: 500 }
        );
    }
}
