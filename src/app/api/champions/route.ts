import ChampionService from "@/services/champions.service";
import { AddChampionSchema, DeleteChampionSchema, EditChampionSchema } from "@/types/champions.types";
import { NextResponse } from "next/server";

const championService = new ChampionService();

export async function GET() {
    const champions = await championService.getChampions();
    return NextResponse.json({ champions, count: champions.length }, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddChampionSchema.safeParse(body);

        console.log("RESULT: ", result.success);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const newChampion = await championService.addChampion(validatedBody);
        return NextResponse.json({ newChampion }, { status: 201 });
    } catch (error) {
        console.error('Error adding champion:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditChampionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedChampion = await championService.editChampion(validatedBody);
        return NextResponse.json({ updatedChampion }, { status: 200 });
    } catch (error) {
        console.error('Error updating champion:', error);
        return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteChampionSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedChampion = await championService.deleteChampion(validatedBody);
        return NextResponse.json({ deletedChampion }, { status: 200 });
    } catch (error) {
        console.error('Error deleting champion:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the champion.' }, { status: 500 });
    }
}
