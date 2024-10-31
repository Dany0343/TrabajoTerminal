/*
  Warnings:

  - Added the required column `parameterId` to the `MeasurementRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MeasurementRule" DROP CONSTRAINT "MeasurementRule_id_fkey";

-- AlterTable
ALTER TABLE "MeasurementRule" ADD COLUMN     "parameterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MeasurementRule" ADD CONSTRAINT "MeasurementRule_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
