import CategoryService from "@/src/services/category.service";
import { NextRequest, NextResponse } from "next/server";
import { AddMerchCategorySchema } from "@/src/types/merchCategories.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";

const categoryService = new CategoryService();

function accessErrorResponse(error: "UNAUTHENTICATED" | "FORBIDDEN" | "SERVICE_ERROR", message: string) {
  return NextResponse.json(
    { error: message },
    { status: error === "UNAUTHENTICATED" ? 401 : error === "FORBIDDEN" ? 403 : 502 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      const categories = await categoryService.getCategories();
      return NextResponse.json(
        { categories, count: categories.length },
        { status: 200 },
      );
    } else {
      const category = await categoryService.getCategoryById(categoryId);
      return NextResponse.json({ category }, { status: 200 });
    }
  } catch (error) {
    console.log("Error in fetching merch categories: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occured while fetching merch categories",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) {
    return accessErrorResponse(access.error, access.message);
  }

  try {
    const body = await req.json();
    const result = AddMerchCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Category validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;
    const newCategory = await categoryService.addCategory(validatedBody);
    return NextResponse.json({ newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error adding category: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while adding the category.",
      },
      { status: 500 },
    );
  }
}


