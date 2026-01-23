-- CreateTable
CREATE TABLE "merchandise_categories" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "img_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchandise_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise_products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "product_title" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(50),
    "product_price" DECIMAL(10,2) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "img_urls" JSONB NOT NULL,
    "designers" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchandise_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "merchandise_products_category_id_idx" ON "merchandise_products"("category_id");

-- AddForeignKey
ALTER TABLE "merchandise_products" ADD CONSTRAINT "merchandise_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "merchandise_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
