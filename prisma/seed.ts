import { prisma } from "@/src/lib/prisma";
import PRODUCTS from "@/src/constants/products.json";
import CATEGORIES from "@/src/constants/categories.json";

async function main() {
  if (process.env.NODE_ENV !== "development")
    throw new Error("Cannot run seed script. Database must be in development.");

  for (const cat of CATEGORIES) {
    await prisma.merchandiseCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        categoryName: cat.categoryName,
        imgUrl: cat.imgUrl,
      },
    });
  }

  for (const p of PRODUCTS) {
    await prisma.merchandiseProduct.upsert({
      where: { id: p.id },
      update: {
        productPrice: p.price,
        isAvailable: p.isAvailable,
      },
      create: {
        id: p.id,
        categoryId: p.categoryId,
        productTitle: p.title,
        productSize: p.size,
        productPrice: p.price,
        isAvailable: p.isAvailable,
        imgUrls: p.imgUrls,
        designers: p.designer || [],
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
