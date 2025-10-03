export const runtime = "nodejs"; // Prisma needs Node runtime

import { NextResponse } from "next/server";
import GameService from "@/services/games.service";
import { EditGameSchema } from "@/types/games.types";
const gameService = new GameService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { teamAScore, teamBScore } = (await req.json()) as {
      teamAScore: number | null;
      teamBScore: number | null;
    };

    const current = await gameService.getGameById(id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const winnerId =
      teamAScore == null || teamBScore == null
        ? null
        : teamAScore === teamBScore
        ? null
        : teamAScore > teamBScore
        ? current.teamAId
        : current.teamBId;

    const updated = await gameService.editGame({
      id,
      gameTypeId: current.gameTypeId,
      teamAId: current.teamAId,
      teamBId: current.teamBId,
      startDate: current.startDate.toISOString(),
      endDate: current.endDate.toISOString(),
      location: current.location ?? undefined,
      teamAScore: teamAScore ?? -1,
      teamBScore: teamBScore ?? -1,
      winnerId,
    });

    // Return the updated game object directly
    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const deleted = await gameService.deleteGame({ id });
    return NextResponse.json(deleted, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const id = Number(params.id);
      if (!Number.isFinite(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      }
  
      const body = await req.json();
  
      // Merge URL param into body so Zod sees the id it requires
      const parsed = EditGameSchema.safeParse({ ...body, id });
  
      if (!parsed.success) {
        const message = parsed.error.issues.map(i => i.message).join(", ");
        return NextResponse.json({ error: message }, { status: 400 });
      }
  
      const updatedGame = await gameService.editGame(parsed.data);
  
      // Return the row directly (not { updatedGame }) so your client code works as-is
      return NextResponse.json(updatedGame, { status: 200 });
    } catch (error: any) {
      console.error("Error updating game:", error);
      return NextResponse.json({ error: error?.message ?? "Server error" }, { status: 500 });
    }
  }