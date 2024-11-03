/*
  Warnings:

  - You are about to drop the column `resolvedBy` on the `Alert` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_resolvedBy_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "resolvedBy";
