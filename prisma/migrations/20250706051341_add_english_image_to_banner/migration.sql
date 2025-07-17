/*
  Warnings:

  - A unique constraint covering the columns `[imageEnId]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "imageEnId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Banner_imageEnId_key" ON "Banner"("imageEnId");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_imageEnId_fkey" FOREIGN KEY ("imageEnId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
