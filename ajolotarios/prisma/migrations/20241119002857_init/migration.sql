/*
  Warnings:

  - You are about to drop the column `criticalMax` on the `MeasurementRule` table. All the data in the column will be lost.
  - You are about to drop the column `criticalMin` on the `MeasurementRule` table. All the data in the column will be lost.
  - You are about to drop the column `warningMax` on the `MeasurementRule` table. All the data in the column will be lost.
  - You are about to drop the column `warningMin` on the `MeasurementRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MeasurementRule" DROP COLUMN "criticalMax",
DROP COLUMN "criticalMin",
DROP COLUMN "warningMax",
DROP COLUMN "warningMin";
