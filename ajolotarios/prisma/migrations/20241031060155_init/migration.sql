/*
  Warnings:

  - You are about to alter the column `name` on the `Ajolotary` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `permitNumber` on the `Ajolotary` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The `status` column on the `Alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `Axolotl` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `species` on the `Axolotl` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `size` on the `Axolotl` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `optimalMin` on the `MeasurementRule` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `optimalMax` on the `MeasurementRule` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `magnitude` on the `Parameter` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Parameter` table. All the data in the column will be lost.
  - You are about to drop the column `magnitude` on the `Sensor` table. All the data in the column will be lost.
  - You are about to alter the column `model` on the `Sensor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Tank` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `capacity` on the `Tank` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the `_MeasurementToParameter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serialNumber]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Ajolotary` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `alertType` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Axolotl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Axolotl` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `health` on the `Axolotl` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stage` on the `Axolotl` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensorId` to the `Measurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criticalMax` to the `MeasurementRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criticalMin` to the `MeasurementRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warningMax` to the `MeasurementRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warningMin` to the `MeasurementRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magnitudeId` to the `Parameter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Parameter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magnitudeId` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextCalibrationAt` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Tank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TankStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'QUARANTINE');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('TEMPERATURE', 'PH', 'OXYGEN', 'CONDUCTIVITY', 'AMMONIA');

-- CreateEnum
CREATE TYPE "SensorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FAULTY', 'CALIBRATING');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'SICK', 'CRITICAL', 'RECOVERING', 'QUARANTINE');

-- CreateEnum
CREATE TYPE "LifeStage" AS ENUM ('EGG', 'LARVAE', 'JUVENILE', 'ADULT', 'BREEDING');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PARAMETER_OUT_OF_RANGE', 'DEVICE_MALFUNCTION', 'MAINTENANCE_REQUIRED', 'SYSTEM_ERROR', 'CALIBRATION_NEEDED', 'HEALTH_ISSUE');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED', 'ESCALATED');

-- AlterEnum
ALTER TYPE "Priority" ADD VALUE 'CRITICAL';

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_measurementId_fkey";

-- DropForeignKey
ALTER TABLE "Axolotl" DROP CONSTRAINT "Axolotl_tankId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_tankId_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementRule" DROP CONSTRAINT "MeasurementRule_parameterId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Tank" DROP CONSTRAINT "Tank_ajolotaryId_fkey";

-- DropForeignKey
ALTER TABLE "_MeasurementToParameter" DROP CONSTRAINT "_MeasurementToParameter_A_fkey";

-- DropForeignKey
ALTER TABLE "_MeasurementToParameter" DROP CONSTRAINT "_MeasurementToParameter_B_fkey";

-- AlterTable
ALTER TABLE "Ajolotary" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "permitNumber" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "resolvedBy" INTEGER,
DROP COLUMN "alertType",
ADD COLUMN     "alertType" "AlertType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AlertStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Axolotl" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observations" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weight" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "species" SET DATA TYPE VARCHAR(50),
DROP COLUMN "health",
ADD COLUMN     "health" "HealthStatus" NOT NULL,
ALTER COLUMN "size" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "stage",
ADD COLUMN     "stage" "LifeStage" NOT NULL;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" VARCHAR(50) NOT NULL,
ADD COLUMN     "serialNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sensorId" INTEGER NOT NULL,
ALTER COLUMN "dateTime" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MeasurementRule" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "criticalMax" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "criticalMin" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "warningMax" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "warningMin" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "optimalMin" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "optimalMax" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Parameter" DROP COLUMN "magnitude",
DROP COLUMN "type",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "magnitudeId" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "magnitude",
ADD COLUMN     "calibratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "magnitudeId" INTEGER NOT NULL,
ADD COLUMN     "nextCalibrationAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "serialNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "status" "SensorStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "model" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastConnection" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "SensorType" NOT NULL;

-- AlterTable
ALTER TABLE "Tank" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "TankStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "capacity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20);

-- DropTable
DROP TABLE "_MeasurementToParameter";

-- CreateTable
CREATE TABLE "MeasurementParameter" (
    "id" SERIAL NOT NULL,
    "measurementId" INTEGER NOT NULL,
    "parameterId" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "MeasurementParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magnitude" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Magnitude_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Magnitude_name_key" ON "Magnitude"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_serialNumber_key" ON "Sensor"("serialNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_ajolotaryId_fkey" FOREIGN KEY ("ajolotaryId") REFERENCES "Ajolotary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_magnitudeId_fkey" FOREIGN KEY ("magnitudeId") REFERENCES "Magnitude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementParameter" ADD CONSTRAINT "MeasurementParameter_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementParameter" ADD CONSTRAINT "MeasurementParameter_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parameter" ADD CONSTRAINT "Parameter_magnitudeId_fkey" FOREIGN KEY ("magnitudeId") REFERENCES "Magnitude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Axolotl" ADD CONSTRAINT "Axolotl_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementRule" ADD CONSTRAINT "MeasurementRule_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
