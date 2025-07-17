/*
  Warnings:

  - A unique constraint covering the columns `[slug,language]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Category_slug_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'vi';

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "categoryEnId" TEXT;

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageId" TEXT,
    "imageEnId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_imageId_key" ON "Equipment"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_imageEnId_key" ON "Equipment"("imageEnId");

-- CreateIndex
CREATE INDEX "Equipment_showOnHomepage_idx" ON "Equipment"("showOnHomepage");

-- CreateIndex
CREATE INDEX "Equipment_order_idx" ON "Equipment"("order");

-- CreateIndex
CREATE INDEX "Category_language_idx" ON "Category"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_language_key" ON "Category"("slug", "language");

-- CreateIndex
CREATE INDEX "News_categoryEnId_idx" ON "News"("categoryEnId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_imageEnId_fkey" FOREIGN KEY ("imageEnId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryEnId_fkey" FOREIGN KEY ("categoryEnId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
