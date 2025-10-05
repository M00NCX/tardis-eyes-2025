/*
  Warnings:

  - Changed the type of `planet` on the `Annotation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Annotation" DROP COLUMN "planet",
ADD COLUMN     "planet" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Planet";

-- CreateIndex
CREATE INDEX "Annotation_planet_idx" ON "Annotation"("planet");
