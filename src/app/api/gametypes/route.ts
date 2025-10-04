import { NextResponse } from "next/server";
import GameTypeService from "@/services/gametypes.service";
import { AddGameTypeSchema, DeleteGameTypeSchema, EditGameTypeSchema } from "@/types/gametypes.types";

const gameTypeService = new GameTypeService()

export async function GET() {
    try {
        const gametypes = await gameTypeService.getGameTypes()
        return NextResponse.json({ gametypes, count: gametypes.length }, { status: 200 });
    }
    catch (error) {
        console.error("Error in fetching gametypes: ", error);
        return NextResponse.json({ error: "An unexpected error occurred while fetching gametypes." }, { status: 500 });
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

        const newGameType = await gameTypeService.addGameType(validatedBody);
        return NextResponse.json({ newGameType }, { status: 201 });
    } catch (error) {
        console.error('Error adding gametype:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while adding the gametype.' }, { status: 500 });
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
        const updatedTeam = await gameTypeService.editGameType(validatedBody);
        return NextResponse.json({ updatedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while updating the team.' }, { status: 500 });
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
        const deletedTeam = await gameTypeService.deleteGameType(validatedBody);
        return NextResponse.json({ deletedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while deleting the team.' }, { status: 500 });
    }
}
