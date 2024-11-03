/*
  Warnings:

  - You are about to drop the column `createdBy` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_createdBy_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdBy";
