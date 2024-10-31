/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Ajolotary` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ajolotary` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Axolotl` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Axolotl` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Tank` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tank` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ajolotary" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Axolotl" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Tank" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
