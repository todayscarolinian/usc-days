import CategoryService from "@/src/services/category.service";
import { NextRequest, NextResponse } from "next/server";
import {
  AddMerchCategorySchema,
  DeleteMerchCategorySchema,
  EditMerchCategorySchema,
} from "@/src/types/merchCategories.types";

const categoryService = new CategoryService();

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = EditMerchCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Category validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;
    const updatedCategory = await categoryService.editCategory(
      String(validatedBody.id),
      validatedBody,
    );

    return NextResponse.json({ updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error editing category: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while editing the category.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const result = DeleteMerchCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Category validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;
    const deletedCategory = await categoryService.deleteCategory(validatedBody);

    return NextResponse.json({ deletedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while deleting category.",
      },
      { status: 500 },
    );
  }
}
