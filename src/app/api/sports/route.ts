import { NextResponse } from "next/server";
import GameTypeService from "@/services/gametypes.service";
import { AddGameTypeSchema, DeleteGameTypeSchema, EditGameTypeSchema } from "@/types/gametypes.types";

const gameTypeService = new GameTypeService()

export async function GET() {
    try {
        const sports = await gameTypeService.getGameTypes()
        return NextResponse.json({ sports, count: sports.length }, { status: 200 });
    }
    catch (error) {
        console.error("Error in fetching sports: ", error);
        return NextResponse.json({ error: "An unexpected error occurred while fetching sports." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AddGameTypeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;

        const newSport = await gameTypeService.addGameType(validatedBody);
        return NextResponse.json({ newSport }, { status: 201 });
    } catch (error) {
        console.error('Error adding sport:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while adding the sport.' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const result = EditGameTypeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const updatedSport = await gameTypeService.editGameType(validatedBody);
        return NextResponse.json({ updatedSport }, { status: 200 });
    } catch (error) {
        console.error('Error updating sport:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while updating the sport.' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const result = DeleteGameTypeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const validatedBody = result.data;
        const deletedSport = await gameTypeService.deleteGameType(validatedBody);
        return NextResponse.json({ deletedSport }, { status: 200 });
    } catch (error) {
        console.error('Error deleting sport:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the sport.' }, { status: 500 });
    }
}
