import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@/src/lib/prisma/generated/client";
import { ApiError } from "@/src/lib/api";
import {
  AddMerchProductPayload,
  EditMerchProductPayload,
} from "@/src/types/merchProducts.types";

export interface GetProductsParams {
  categoryId?: number;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Maps the API payload onto the Prisma column names (shared by create and replace).
function toProductData(payload: AddMerchProductPayload) {
  return {
    categoryId: payload.categoryId,
    productTitle: payload.title,
    productPrice: payload.price,
    productSize: payload.size,
    isAvailable: payload.isAvailable,
    imgUrls: payload.imgUrls,
    designers:
      payload.designers === null
        ? Prisma.NullableJsonNullValueInput.DbNull
        : payload.designers,
  };
}

class ProductService {
  async getProducts(params: GetProductsParams) {
    const { categoryId, isAvailable, minPrice, maxPrice, size, search, page, pageSize} = params;

    const where: Prisma.MerchandiseProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (typeof isAvailable === "boolean") {
      where.isAvailable = isAvailable;
    }

    if (size) {
      where.productSize = size;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.productPrice = {};
      if (minPrice !== undefined) where.productPrice.gte = minPrice;
      if (maxPrice !== undefined) where.productPrice.lte = maxPrice;
    }

    if (search) {
      where.productTitle = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [products, total] = await prisma.$transaction([
      prisma.merchandiseProduct.findMany({
        where,
        include: { merchandiseCategory: true },
        orderBy: [{ createdAt: "desc" }],
        skip: (page && pageSize) ? (page - 1) * pageSize : undefined,
        take: pageSize,
      }),
      prisma.merchandiseProduct.count({ where }),
    ]);

    return { products, total };
  }

  async getProductById(productId: number) {
    const product = await prisma.merchandiseProduct.findUnique({
      where: { id: productId },
      include: { merchandiseCategory: true },
    });

    if (!product) {
      throw new ApiError("NOT_FOUND", "Product not found.");
    }

    return product;
  }

  async addProduct(payload: AddMerchProductPayload) {
    return prisma.merchandiseProduct.create({
      data: toProductData(payload),
      include: { merchandiseCategory: true },
    });
  }

  async editProduct(productId: number, payload: EditMerchProductPayload) {
    return prisma.merchandiseProduct.update({
      where: { id: productId },
      data: toProductData(payload),
      include: { merchandiseCategory: true },
    });
  }

  async deleteProduct(productId: number) {
    return prisma.merchandiseProduct.delete({
      where: { id: productId },
    });
  }
}

export default ProductService;