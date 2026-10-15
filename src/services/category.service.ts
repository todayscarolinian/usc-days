import { prisma } from "@/src/lib/prisma";
import { ApiError } from "@/src/lib/api";

import {
  AddMerchCategoryPayload,
  EditMerchCategoryPayload,
} from "@/src/types/merchCategories.types";

// Prisma errors are left to propagate so route handlers can map them
// (P2025 -> 404, P2002 / P2003 -> 409) via handleRouteError.
class CategoryService {
  async getCategories() {
    return prisma.merchandiseCategory.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async getCategoryById(categoryId: number) {
    const category = await prisma.merchandiseCategory.findUnique({
      where: { id: categoryId },
      include: {
        merchandiseProducts: true,
      },
    });

    if (!category) {
      throw new ApiError("NOT_FOUND", "Category not found.");
    }

    return category;
  }

  async addCategory(payload: AddMerchCategoryPayload) {
    return prisma.merchandiseCategory.create({
      data: {
        categoryName: payload.name,
        imgUrl: payload.imgUrl,
      },
    });
  }

  async editCategory(categoryId: number, payload: EditMerchCategoryPayload) {
    return prisma.merchandiseCategory.update({
      where: { id: categoryId },
      data: {
        categoryName: payload.name,
        imgUrl: payload.imgUrl,
      },
    });
  }

  async deleteCategory(categoryId: number) {
    return prisma.merchandiseCategory.delete({
      where: { id: categoryId },
    });
  }
}

export default CategoryService;