/*
  Warnings:

  - A unique constraint covering the columns `[parameterId]` on the table `MeasurementRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MeasurementRule_parameterId_key" ON "MeasurementRule"("parameterId");
