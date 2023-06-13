/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `seasons` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `seasons` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[grandPrix,seasonId]` on the table `races` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `laps` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `circuit` to the `races` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `races` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "laps" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "races" ADD COLUMN     "circuit" TEXT NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "_SeasonToTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeasonToTeam_AB_unique" ON "_SeasonToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_SeasonToTeam_B_index" ON "_SeasonToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "races_grandPrix_seasonId_key" ON "races"("grandPrix", "seasonId");

-- AddForeignKey
ALTER TABLE "_SeasonToTeam" ADD CONSTRAINT "_SeasonToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeasonToTeam" ADD CONSTRAINT "_SeasonToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
