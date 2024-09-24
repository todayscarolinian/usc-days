import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Score } from "@/types/scores.types";

// GET /api/scores - fetch all scores
export async function GET() {
  const scores: Score[] = await prisma.score.findMany({
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
  const { gameId, teamAScore, teamBScore, createdBy } =
    (await req.json()) as Score;

  if (
    !gameId ||
    teamAScore === undefined ||
    teamBScore === undefined ||
    !createdBy
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newScore = await prisma.score.create({
    data: {
      gameId,
      teamAScore,
      teamBScore,
      createdBy,
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
  const { gameId, teamAScore, teamBScore } = (await req.json()) as Score;

  const updatedScore = await prisma.score.update({
    where: { gameId },
    data: { teamAScore, teamBScore },
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
  const { gameId } = (await req.json()) as Score;

  const deletedScore = await prisma.score.delete({
    where: { gameId },
  });

  if (!deletedScore) {
    return NextResponse.json(
      { error: "Unable to delete score" },
      { status: 500 }
    );
  }

  return NextResponse.json({ deletedScore }, { status: 200 });
}
