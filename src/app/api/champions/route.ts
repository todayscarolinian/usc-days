import ChampionService, {
    GetChampionsParams,
} from "@/services/champions.service";
import {
    AddChampionSchema,
    DeleteChampionSchema,
    EditChampionSchema,
} from "@/types/champions.types";
import { NextRequest, NextResponse } from "next/server";

const championService = new ChampionService();

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const params: GetChampionsParams = {};

        const teamId = searchParams.get("teamId");
        if (teamId) {
            const parsed = parseInt(teamId, 10);
            if (!isNaN(parsed)) params.teamId = parsed;
        }

        const gameTypeId = searchParams.get("gameTypeId");
        if (gameTypeId) {
            const parsed = parseInt(gameTypeId, 10);
            if (!isNaN(parsed)) params.gameTypeId = parsed;
        }

        const rank = searchParams.get("rank");
        if (rank) {
            const parsed = parseInt(rank, 10);
            if(!isNaN(parsed)) params.rank = parsed;
        }

        const startDate = searchParams.get("startDate");
        if (startDate) {
            const parsed = new Date(startDate);
            if (!isNaN(parsed.getTime())) params.startDate = parsed;
        }

        const endDate = searchParams.get("endDate");
        if (endDate) {
            const parsed = new Date(endDate);
            if (!isNaN(parsed.getTime())) params.endDate = parsed;
        }

        const champions = await championService.getChampions(params);
        return NextResponse.json(
            { champions, count: champions.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching champions:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while fetching champions." },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddChampionSchema.safeParse(body);

        console.log("RESULT: ", result.success);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const newChampion = await championService.addChampion(validatedBody);
        return NextResponse.json({ newChampion }, { status: 201 });
    } catch (error) {
        console.error("Error adding champion:", error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditChampionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedChampion = await championService.editChampion(
            validatedBody
        );
        return NextResponse.json({ updatedChampion }, { status: 200 });
    } catch (error) {
        console.error("Error updating champion:", error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteChampionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedChampion = await championService.deleteChampion(
            validatedBody
        );
        return NextResponse.json({ deletedChampion }, { status: 200 });
    } catch (error) {
        console.error("Error deleting champion:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while deleting the champion.",
            },
            { status: 500 }
        );
    }
}
