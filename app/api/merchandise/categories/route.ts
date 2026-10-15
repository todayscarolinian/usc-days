import CategoryService from "@/src/services/category.service";
import { NextResponse } from "next/server";
import { AddMerchCategorySchema } from "@/src/types/merchCategories.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import { accessErrorResponse, handleRouteError, parseJsonBody } from "@/src/lib/api";

const categoryService = new CategoryService();

export async function GET() {
  try {
    const categories = await categoryService.getCategories();
    return NextResponse.json({ data: categories });
  } catch (error) {
    return handleRouteError(error, "Could not fetch categories.");
  }
}

export async function POST(req: Request) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const body = await parseJsonBody(req, AddMerchCategorySchema);
  if (!body.ok) return body.response;

  try {
    const category = await categoryService.addCategory(body.data);
    return NextResponse.json(category, {
      status: 201,
      headers: { Location: `/api/merchandise/categories/${category.id}` },
    });
  } catch (error) {
    return handleRouteError(error, "Could not create category.");
  }
}