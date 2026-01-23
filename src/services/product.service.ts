import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@/src/lib/prisma/generated/client";
import {
  AddMerchProductPayload,
  EditMerchProductPayload,
  DeleteMerchProductPayload 
} from "@/src/types/merchProducts.types";

export interface GetProductsParams {
  categoryId?: number;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  search?: string;
}

class ProductService {
  async getProducts(params: GetProductsParams) {
    try {
        const { categoryId, isAvailable, minPrice, maxPrice, size, search } = params;

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

      return await prisma.merchandiseProduct.findMany({
        where,
        include: {
          merchandiseCategory: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } catch (error) {
      console.error("getProducts error:", error);
      throw new Error("Could not fetch products");
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await prisma.merchandiseProduct.findUnique({
        where: { id: productId },
        include: {
          merchandiseCategory: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      console.error("getProductById error:", error);
      throw new Error("Could not fetch product");
    }
  }

  async addProduct(payload: AddMerchProductPayload) {
    try {
      const data = {
        categoryId: payload.categoryId,
        productTitle: payload.title,
        productPrice: payload.price,
        productSize: payload.size,
        isAvailable: payload.isAvailable,
        imgUrls: payload.imgUrls,
        designers: payload.designers === null ? Prisma.NullableJsonNullValueInput.DbNull : payload.designers,
      };
      return await prisma.merchandiseProduct.create({
        data,
        include: {
          merchandiseCategory: true,
        },
      });
    } catch (error) {
      console.error("addProduct error:", error);
      throw new Error("Could not create product");
    }
  }

  async editProduct(productId: number, payload: EditMerchProductPayload) {
    try {
      const { ...updateData } = payload;
      const data = {
        ...updateData,
        designers: updateData.designers === null ? Prisma.NullableJsonNullValueInput.DbNull : updateData.designers,
      };
      return await prisma.merchandiseProduct.update({
        where: { id: productId },
        data,
        include: {
          merchandiseCategory: true,
        },
      });
    } catch (error) {
      console.error("editProduct error:", error);
      throw new Error("Could not update product");
    }
  }

  async deleteProduct(payload: DeleteMerchProductPayload) {
    try {
      return await prisma.merchandiseProduct.delete({
        where: { id: payload.id },
      });
    } catch (error) {
      console.error("deleteProduct error:", error);
      throw new Error("Could not delete product");
    }
  }
}

export default ProductService;
