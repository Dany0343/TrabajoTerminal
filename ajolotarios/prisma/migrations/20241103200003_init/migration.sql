/*
  Warnings:

  - You are about to drop the column `magnitudeId` on the `Parameter` table. All the data in the column will be lost.
  - You are about to drop the column `magnitudeId` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the `Magnitude` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `magnitude` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parameter" DROP CONSTRAINT "Parameter_magnitudeId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_magnitudeId_fkey";

-- AlterTable
ALTER TABLE "Parameter" DROP COLUMN "magnitudeId";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "magnitudeId",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "magnitude" VARCHAR(50) NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Magnitude";

-- DropEnum
DROP TYPE "SensorStatus";

-- DropEnum
DROP TYPE "SensorType";

-- CreateTable
CREATE TABLE "SensorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "SensorStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_name_key" ON "SensorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorStatus_status_key" ON "SensorStatus"("status");

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "SensorStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
