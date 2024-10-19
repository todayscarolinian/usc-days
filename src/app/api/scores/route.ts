import { NextResponse } from "next/server";
import ScoreService from "@/services/scores.service";
import { AddScoreSchema, DeleteScoreSchema, EditScoreSchema } from "@/types/scores.types";

const scoreService = new ScoreService();

// GET /api/scores - fetch all scores
export async function GET() {
  try {
    const scores = await scoreService.getScores();
    return NextResponse.json({ scores, count: scores.length }, { status: 200 });
  } catch (error: any) {
    console.error("Error in fetching scores: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/scores - Add a new score
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = AddScoreSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const validatedBody = result.data;

    const newScore = await scoreService.createScore(validatedBody);

    return NextResponse.json({ newScore });
  } catch (error: any) {
    console.error("Error creating score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/scores - Edit an existing score
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = EditScoreSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const validatedBody = result.data;

    const updatedScore = await scoreService.editScore(validatedBody);

    return NextResponse.json({ updatedScore }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/scores - Delete a score
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const result = DeleteScoreSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const validatedBody = result.data;

    const deletedScore = await scoreService.deleteScore(validatedBody);

    return NextResponse.json({ deletedScore }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting score: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
