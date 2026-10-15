import { NextResponse } from "next/server";
import ProductService from "@/src/services/product.service";
import { EditMerchProductSchema } from "@/src/types/merchProducts.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import {
  accessErrorResponse,
  handleRouteError,
  parseIdParam,
  parseJsonBody,
} from "@/src/lib/api";

const productService = new ProductService();

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    const product = await productService.getProductById(id.data);
    return NextResponse.json(product);
  } catch (error) {
    return handleRouteError(error, "Could not fetch product.");
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  const body = await parseJsonBody(req, EditMerchProductSchema);
  if (!body.ok) return body.response;

  try {
    const product = await productService.editProduct(id.data, body.data);
    return NextResponse.json(product);
  } catch (error) {
    return handleRouteError(error, "Could not update product.");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const id = parseIdParam((await params).id);
  if (!id.ok) return id.response;

  try {
    await productService.deleteProduct(id.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Could not delete product.");
  }
}