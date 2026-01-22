import { prisma } from "@/src/lib/prisma";

import {
  AddMerchCategoryPayload,
  EditMerchCategoryPayload,
  DeleteMerchCategoryPayload 
} from "@/src/types/merchCategories.types";

class CategoryService {
  async getCategories() {
    try {
      return await prisma.merchandiseCategory.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } catch (error) {
      console.error("getCategories error:", error);
      throw new Error("Could not fetch categories");
    }
  }

  async getCategoryById(categoryId: string) {
    try {
      const category = await prisma.merchandiseCategory.findUnique({
        where: { id: parseInt(categoryId) },
        include: {
          merchandiseProducts: true,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    } catch (error) {
      console.error("getCategoryById error:", error);
      throw new Error("Could not fetch category");
    }
  }

  async addCategory(payload: AddMerchCategoryPayload) {
    try {
      const data = {
        categoryName: payload.name,
        imgUrl: payload.imgUrl,
      };
      
      return await prisma.merchandiseCategory.create({
        data,
      });
    } catch (error) {
      console.error("addCategory error:", error);
      throw new Error("Could not create category");
    }
  }

  async editCategory(categoryId: string, payload: EditMerchCategoryPayload) {
    try {
      const {...updateData } = payload;
      const data = {
        categoryName: updateData.name,
        imgUrl: updateData.imgUrl,
      };
      
      return await prisma.merchandiseCategory.update({
        where: { id: parseInt(categoryId) },
        data,
      });
    } catch (error) {
      console.error("editCategory error:", error);
      throw new Error("Could not update category");
    }
  }

  async deleteCategory(payload: DeleteMerchCategoryPayload) {
    try {
      return await prisma.merchandiseCategory.delete({
        where: { id: payload.id },
      });
    } catch (error) {
      console.error("deleteCategory error:", error);
      throw new Error("Could not delete category");
    }
  }
}

export default CategoryService;