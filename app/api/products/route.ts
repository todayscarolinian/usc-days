import { NextRequest, NextResponse } from "next/server";
import ProductService from "@/src/services/product.service";
import {
  AddMerchProductSchema,
  DeleteMerchProductSchema,
  EditMerchProductSchema,
} from "@/src/types/merchProducts.types";
import { GetProductsParams } from "@/src/services/product.service";
import { requireHeraldAccess, isAccessError } from "@/src/lib/herald/require-access";

const productService = new ProductService();

function accessErrorResponse(error: "UNAUTHENTICATED" | "FORBIDDEN" | "SERVICE_ERROR", message: string) {
  return NextResponse.json(
    { error: message },
    { status: error === "UNAUTHENTICATED" ? 401 : error === "FORBIDDEN" ? 403 : 502 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const productParams: GetProductsParams = {};

    const rawCategoryId = searchParams.get("categoryId");
    if (rawCategoryId) {
      const categoryId = parseInt(rawCategoryId, 10);
      if (!isNaN(categoryId)) productParams.categoryId = categoryId;
    }

    const isAvailable = searchParams.get("isAvailable");
    if (isAvailable) {
      productParams.isAvailable = isAvailable === "true";
    }

    const rawMinPrice = searchParams.get("minPrice");
    if (rawMinPrice) {
      const minPrice = parseFloat(rawMinPrice);
      if (!isNaN(minPrice)) productParams.minPrice = minPrice;
    }

    const rawMaxPrice = searchParams.get("maxPrice");
    if (rawMaxPrice) {
      const maxPrice = parseFloat(rawMaxPrice);
      if (!isNaN(maxPrice)) productParams.maxPrice = maxPrice;
    }

    const size = searchParams.get("size");
    if (size) productParams.size = size;

    const search = searchParams.get("string");
    if (search) productParams.search = search;

    const products = await productService.getProducts(productParams);
    return NextResponse.json(
      { products, count: products.length },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching products: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occured while fetching products.",
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
    const result = AddMerchProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Product validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;
    const newProduct = await productService.addProduct(validatedBody);
    return NextResponse.json({ newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error adding product: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while adding the product.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) {
    return accessErrorResponse(access.error, access.message);
  }

  try {
    const body = await req.json();
    const result = EditMerchProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Product validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;

    // NOTE: Product ID already specified in the payload
    const updatedProduct = await productService.editProduct(
      validatedBody.id,
      validatedBody,
    );

    return NextResponse.json({ updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error editing product: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while editing product.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const access = await requireHeraldAccess(req.headers.get("cookie"));
  if (isAccessError(access)) {
    return accessErrorResponse(access.error, access.message);
  }

  try {
    const body = await req.json();
    const result = DeleteMerchProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: `Product validation error: ${result.error}` },
        { status: 400 },
      );
    }

    const validatedBody = result.data;

    const deletedProduct = await productService.deleteProduct(validatedBody);

    return NextResponse.json({ deletedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while deleting product.",
      },
      { status: 500 },
    );
  }
}
