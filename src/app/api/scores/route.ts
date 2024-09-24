import { NextResponse } from "next/server";
import ScoreService from "@/services/scores.service";
import { Score } from "@/types/scores.types";

const scoreService = new ScoreService();

// GET /api/scores - fetch all scores
export async function GET() {
  try {
    const scores = await scoreService.getScores();

    if (!scores) {
      return NextResponse.json({ scores: null }, { status: 401 });
    }

    NextResponse.json({ scores }, { status: 200 });
  } catch (error: any) {
    console.error("Error in fetching scores: ", error);
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/scores - Add a new score
export async function POST(req: Request) {
  try {
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
        { status: 400 },
      );
    }

    const newScore = await scoreService.createScore({
      gameId,
      teamAScore,
      teamBScore,
      createdBy,
    });

    return NextResponse.json({ newScore });
  } catch (error: any) {
    console.error("Error creating score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/scores - Edit an existing score
export async function PUT(req: Request) {
  try {
    const { gameId, teamAScore, teamBScore } = (await req.json()) as Score;
    const updatedScore = await scoreService.updateScore({
      gameId,
      teamAScore,
      teamBScore,
    });

    return NextResponse.json({ updatedScore }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/scores - Delete a score
export async function DELETE(req: Request) {
  try {
    const { gameId } = (await req.json()) as Score;
    const deletedScore = await scoreService.deleteScore(gameId);

    return NextResponse.json({ deletedScore }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
