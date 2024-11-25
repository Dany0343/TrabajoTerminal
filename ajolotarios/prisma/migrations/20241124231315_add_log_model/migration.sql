/*
  Warnings:

  - You are about to drop the column `description` on the `Log` table. All the data in the column will be lost.
  - Changed the type of `action` on the `Log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "description",
ADD COLUMN     "details" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "ActionType" NOT NULL;

-- DropEnum
DROP TYPE "Action";

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
