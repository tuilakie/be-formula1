/*
  Warnings:

  - The primary key for the `Ranking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `driverId` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `raceId` on the `Ranking` table. All the data in the column will be lost.
  - The primary key for the `drivers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `drivers` table. All the data in the column will be lost.
  - The primary key for the `races` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `races` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `races` table. All the data in the column will be lost.
  - The primary key for the `seasons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `seasons` table. All the data in the column will be lost.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the `_DriverToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SeasonToTeam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `driverName` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grandPrix` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonName` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonName` to the `races` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_raceId_fkey";

-- DropForeignKey
ALTER TABLE "_DriverToTeam" DROP CONSTRAINT "_DriverToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_DriverToTeam" DROP CONSTRAINT "_DriverToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "_SeasonToTeam" DROP CONSTRAINT "_SeasonToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_SeasonToTeam" DROP CONSTRAINT "_SeasonToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "races" DROP CONSTRAINT "races_seasonId_fkey";

-- DropIndex
DROP INDEX "drivers_name_key";

-- DropIndex
DROP INDEX "races_grandPrix_seasonId_key";

-- DropIndex
DROP INDEX "seasons_name_key";

-- DropIndex
DROP INDEX "teams_name_key";

-- AlterTable
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_pkey",
DROP COLUMN "driverId",
DROP COLUMN "raceId",
ADD COLUMN     "driverName" TEXT NOT NULL,
ADD COLUMN     "grandPrix" TEXT NOT NULL,
ADD COLUMN     "seasonName" TEXT NOT NULL,
ADD CONSTRAINT "Ranking_pkey" PRIMARY KEY ("driverName", "grandPrix", "seasonName");

-- AlterTable
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "drivers_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "races" DROP CONSTRAINT "races_pkey",
DROP COLUMN "id",
DROP COLUMN "seasonId",
ADD COLUMN     "seasonName" TEXT NOT NULL,
ADD CONSTRAINT "races_pkey" PRIMARY KEY ("seasonName", "grandPrix");

-- AlterTable
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "seasons_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("name");

-- DropTable
DROP TABLE "_DriverToTeam";

-- DropTable
DROP TABLE "_SeasonToTeam";

-- CreateTable
CREATE TABLE "DriverTeamSeason" (
    "driverName" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "seasonName" TEXT NOT NULL,

    CONSTRAINT "DriverTeamSeason_pkey" PRIMARY KEY ("driverName","teamName","seasonName")
);

-- AddForeignKey
ALTER TABLE "races" ADD CONSTRAINT "races_seasonName_fkey" FOREIGN KEY ("seasonName") REFERENCES "seasons"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_driverName_fkey" FOREIGN KEY ("driverName") REFERENCES "drivers"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_seasonName_grandPrix_fkey" FOREIGN KEY ("seasonName", "grandPrix") REFERENCES "races"("seasonName", "grandPrix") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_driverName_fkey" FOREIGN KEY ("driverName") REFERENCES "drivers"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_teamName_fkey" FOREIGN KEY ("teamName") REFERENCES "teams"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_seasonName_fkey" FOREIGN KEY ("seasonName") REFERENCES "seasons"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
