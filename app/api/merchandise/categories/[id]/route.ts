import CategoryService from "@/src/services/category.service";
import { NextResponse } from "next/server";
import { EditMerchCategorySchema } from "@/src/types/merchCategories.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import {
  accessErrorResponse,
  handleRouteError,
  parseIdParam,
  parseJsonBody,
} from "@/src/lib/api";

const categoryService = new CategoryService();

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  // id comes from the URL now, so the body is only { name, imgUrl }
  const body = await parseJsonBody(req, EditMerchCategorySchema.omit({ id: true }));
  if (!body.ok) return body.response;

  try {
    const category = await categoryService.editCategory(String(id.data), {
      ...body.data,
      id: id.data,
    });
    return NextResponse.json(category);
  } catch (error) {
    return handleRouteError(error, "Could not update category.");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    await categoryService.deleteCategory({ id: id.data });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Could not delete category.");
  }
}