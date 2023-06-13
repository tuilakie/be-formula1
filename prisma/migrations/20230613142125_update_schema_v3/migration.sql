/*
  Warnings:

  - Changed the type of `points` on the `Ranking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "races_title_key";

-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "points",
ADD COLUMN     "points" INTEGER NOT NULL;
