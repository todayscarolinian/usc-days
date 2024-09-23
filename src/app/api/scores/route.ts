import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import AuthService from "@/services/auth.service";
import { prisma } from "@/lib/prisma";

// GET /api/scores - fetch all scores
export async function GET() {
  const scores = await prisma.score.findMany({
    include: {
      game: {
        include: {
          teamA: true,
          teamB: true,
          gameType: true,
        },
      },
      createdBy: true,
    },
  });

  if (!scores) {
    return NextResponse.json({ scores: null }, { status: 401 });
  }

  return NextResponse.json({ scores }, { status: 200 });
}

// POST /api/scores - Add a new score
export async function POST(req: Request) {
  const { game_id, team_a_score, team_b_score, created_by } = await req.json();

  if (!game_id || !team_a_score || !team_b_score || !created_by) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newScore = await prisma.score.create({
    data: {
      game_id,
      team_a_score,
      team_b_score,
      created_by,
    },
  });

  if (!newScore) {
    return NextResponse.json(
      { error: "Unable to create score" },
      { status: 500 }
    );
  }

  return NextResponse.json({ newScore }, { status: 201 });
}

// PUT /api/scores - Edit an existing score
export async function PUT(req: Request) {
  const { game_id, team_a_score, team_b_score } = await req.json();

  const updatedScore = await prisma.score.update({
    where: { game_id },
    data: { team_a_score, team_b_score },
  });

  if (!updatedScore) {
    return NextResponse.json(
      { error: "Unable to update score" },
      { status: 500 }
    );
  }

  return NextResponse.json({ updatedScore }, { status: 200 });
}

// DELETE /api/scores - Delete a score
export async function DELETE(req: Request) {
  const { game_id } = await req.json();

  const deletedScore = await prisma.score.delete({
    where: { game_id },
  });

  if (!deletedScore) {
    return NextResponse.json(
      { error: "Unable to delete score" },
      { status: 500 }
    );
  }

  return NextResponse.json({ deletedScore }, { status: 200 });
}
