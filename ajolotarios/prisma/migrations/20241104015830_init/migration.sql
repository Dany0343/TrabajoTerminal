/*
  Warnings:

  - You are about to drop the column `magnitude` on the `Sensor` table. All the data in the column will be lost.
  - Added the required column `magnitude` to the `SensorType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "magnitude";

-- AlterTable
ALTER TABLE "SensorType" ADD COLUMN     "magnitude" VARCHAR(50) NOT NULL;
