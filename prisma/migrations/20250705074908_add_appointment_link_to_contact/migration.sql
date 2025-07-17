/*
  Warnings:

  - You are about to drop the column `enKeywords` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `News` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_uploadedById_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "appointmentLink" TEXT;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "enKeywords",
DROP COLUMN "keywords",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "pin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "News_showOnHomepage_idx" ON "News"("showOnHomepage");

-- CreateIndex
CREATE INDEX "News_showOnHomepage_createdAt_idx" ON "News"("showOnHomepage", "createdAt");

-- CreateIndex
CREATE INDEX "News_categoryId_idx" ON "News"("categoryId");

-- CreateIndex
CREATE INDEX "News_pin_idx" ON "News"("pin");

-- CreateIndex
CREATE INDEX "News_pin_createdAt_idx" ON "News"("pin", "createdAt");

-- CreateIndex
CREATE INDEX "Service_showOnHomepage_idx" ON "Service"("showOnHomepage");

-- CreateIndex
CREATE INDEX "Service_showOnHomepage_createdAt_idx" ON "Service"("showOnHomepage", "createdAt");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
