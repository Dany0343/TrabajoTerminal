-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'AJOLATORY_ADMIN', 'AJOLATORY_SUBSCRIBER');

-- CreateEnum
CREATE TYPE "TankStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'QUARANTINE');

-- CreateEnum
CREATE TYPE "SensorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'SICK', 'CRITICAL', 'RECOVERING', 'QUARANTINE');

-- CreateEnum
CREATE TYPE "LifeStage" AS ENUM ('EGG', 'LARVAE', 'JUVENILE', 'ADULT', 'BREEDING');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PARAMETER_OUT_OF_RANGE', 'DEVICE_MALFUNCTION', 'MAINTENANCE_REQUIRED', 'SYSTEM_ERROR', 'CALIBRATION_NEEDED', 'HEALTH_ISSUE');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'RESOLVED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AJOLATORY_SUBSCRIBER',
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ajolotary" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permitNumber" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ajolotary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "capacity" DECIMAL(10,2) NOT NULL,
    "observations" TEXT NOT NULL,
    "status" "TankStatus" NOT NULL DEFAULT 'ACTIVE',
    "ajolotaryId" INTEGER NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "serialNumber" VARCHAR(50) NOT NULL,
    "lastConnection" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "magnitude" VARCHAR(50) NOT NULL,
    "typeId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "calibratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SensorStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "serialNumber" VARCHAR(50) NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "tankId" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" INTEGER NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementParameter" (
    "id" SERIAL NOT NULL,
    "measurementId" INTEGER NOT NULL,
    "parameterId" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "MeasurementParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Axolotl" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "species" VARCHAR(50) NOT NULL,
    "age" INTEGER NOT NULL,
    "health" "HealthStatus" NOT NULL,
    "size" DECIMAL(10,2) NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "stage" "LifeStage" NOT NULL,
    "tankId" INTEGER NOT NULL,
    "observations" TEXT[],

    CONSTRAINT "Axolotl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "measurementId" INTEGER NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementRule" (
    "id" SERIAL NOT NULL,
    "optimalMin" DECIMAL(10,2) NOT NULL,
    "optimalMax" DECIMAL(10,2) NOT NULL,
    "warningMin" DECIMAL(10,2) NOT NULL,
    "warningMax" DECIMAL(10,2) NOT NULL,
    "criticalMin" DECIMAL(10,2) NOT NULL,
    "criticalMax" DECIMAL(10,2) NOT NULL,
    "action" TEXT NOT NULL,
    "parameterId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MeasurementRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AjolotaryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_name_key" ON "SensorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_serialNumber_key" ON "Sensor"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_AjolotaryToUser_AB_unique" ON "_AjolotaryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AjolotaryToUser_B_index" ON "_AjolotaryToUser"("B");

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_ajolotaryId_fkey" FOREIGN KEY ("ajolotaryId") REFERENCES "Ajolotary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementParameter" ADD CONSTRAINT "MeasurementParameter_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementParameter" ADD CONSTRAINT "MeasurementParameter_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Axolotl" ADD CONSTRAINT "Axolotl_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementRule" ADD CONSTRAINT "MeasurementRule_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AjolotaryToUser" ADD CONSTRAINT "_AjolotaryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ajolotary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AjolotaryToUser" ADD CONSTRAINT "_AjolotaryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
