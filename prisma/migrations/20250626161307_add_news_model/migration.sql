/*
  Warnings:

  - You are about to drop the column `postId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[featureImageEnId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostCategory" DROP CONSTRAINT "PostCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PostCategory" DROP CONSTRAINT "PostCategory_postId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "featureImageEnId" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywordsEn" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitleEn" TEXT;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostCategory";

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "shortDescription" TEXT,
    "shortDescriptionEn" TEXT,
    "keywords" TEXT,
    "enKeywords" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featureImageId" TEXT,
    "featureImageEnId" TEXT,
    "metaTitle" TEXT,
    "metaTitleEn" TEXT,
    "metaDescription" TEXT,
    "metaDescriptionEn" TEXT,
    "metaKeywords" TEXT,
    "metaKeywordsEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "imageId" TEXT,
    "imageEnId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "imageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "addressEn" TEXT,
    "businessHours" TEXT,
    "businessHoursEn" TEXT,
    "facebookUrl" TEXT,
    "zaloUrl" TEXT,
    "instagramUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_featureImageId_key" ON "News"("featureImageId");

-- CreateIndex
CREATE UNIQUE INDEX "News_featureImageEnId_key" ON "News"("featureImageEnId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_imageId_key" ON "TeamMember"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_imageEnId_key" ON "TeamMember"("imageEnId");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_type_key" ON "Banner"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_imageId_key" ON "Banner"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_featureImageEnId_key" ON "Service"("featureImageEnId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_featureImageEnId_fkey" FOREIGN KEY ("featureImageEnId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_featureImageId_fkey" FOREIGN KEY ("featureImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_featureImageEnId_fkey" FOREIGN KEY ("featureImageEnId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_imageEnId_fkey" FOREIGN KEY ("imageEnId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
