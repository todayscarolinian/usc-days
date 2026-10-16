import { NextRequest, NextResponse } from "next/server";
import { number, z } from "zod";
import ProductService from "@/src/services/product.service";
import { AddMerchProductSchema } from "@/src/types/merchProducts.types";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";
import {
  accessErrorResponse,
  boolQuery,
  handleRouteError,
  idQuery,
  numberQuery,
  parseJsonBody,
  parseQuery,
  stringQuery,
} from "@/src/lib/api";

const productService = new ProductService();

const GetProductsQuery = z.object({
  categoryId: idQuery,
  isAvailable: boolQuery,
  minPrice: numberQuery,
  maxPrice: numberQuery,
  size: stringQuery,
  search: stringQuery,

  page: numberQuery,
  pageSize: numberQuery,
});

export async function GET(req: NextRequest) {
  const query = parseQuery(req.nextUrl.searchParams, GetProductsQuery);
  if (!query.ok) return query.response;

  try {
    const data = await productService.getProducts(query.data);
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, "Could not fetch products.");
  }
}

export async function POST(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) return accessErrorResponse(access);

  const body = await parseJsonBody(req, AddMerchProductSchema);
  if (!body.ok) return body.response;

  try {
    const product = await productService.addProduct(body.data);
    return NextResponse.json(product, {
      status: 201,
      headers: { Location: `/api/merchandise/products/${product.id}` },
    });
  } catch (error) {
    return handleRouteError(error, "Could not create product.");
  }
}