export const runtime = "nodejs"; // Prisma needs Node runtime

import { NextResponse } from "next/server";
import GameService from "@/services/games.service";
import { EditGameSchema } from "@/types/games.types";
const gameService = new GameService();

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
    return PUT(req, ctx);                           
  }

export async function DELETE(_req: Request, ctx: Ctx) {
    const { id: idStr } = await ctx.params;    
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    try {
      const deleted = await gameService.deleteGame({ id });
      return NextResponse.json(deleted, { status: 200 });
    } catch (e: any) {
      return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
  }
  export async function PUT(req: Request, ctx: Ctx) {
    const { id: idStr } = await ctx.params;      
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
  
    try {
      const body = await req.json();
      const parsed = EditGameSchema.safeParse({ ...body, id });
      if (!parsed.success) {
        const msg = parsed.error.issues.map(i => i.message).join(", ");
        return NextResponse.json({ error: msg }, { status: 400 });
      }
  
      const updated = await gameService.editGame(parsed.data);
      return NextResponse.json(updated, { status: 200 });
    } catch (e: any) {
      return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
  }