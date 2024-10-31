-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'AJOLATORY_ADMIN', 'AJOLATORY_SUBSCRIBER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AJOLATORY_SUBSCRIBER',
    "phone" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ajolotary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permitNumber" TEXT NOT NULL,

    CONSTRAINT "Ajolotary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "observations" TEXT NOT NULL,
    "ajolotaryId" INTEGER NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "tankId" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "lastConnection" TIMESTAMP(3) NOT NULL,
    "magnitude" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "deviceId" INTEGER NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Axolotl" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "health" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "stage" TEXT NOT NULL,
    "tankId" INTEGER NOT NULL,

    CONSTRAINT "Axolotl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "measurementId" INTEGER NOT NULL,
    "alertType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementRule" (
    "id" SERIAL NOT NULL,
    "optimalMin" DOUBLE PRECISION NOT NULL,
    "optimalMax" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "parameterId" INTEGER NOT NULL,

    CONSTRAINT "MeasurementRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "magnitude" TEXT NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AjolotaryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MeasurementToParameter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_AjolotaryToUser_AB_unique" ON "_AjolotaryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AjolotaryToUser_B_index" ON "_AjolotaryToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MeasurementToParameter_AB_unique" ON "_MeasurementToParameter"("A", "B");

-- CreateIndex
CREATE INDEX "_MeasurementToParameter_B_index" ON "_MeasurementToParameter"("B");

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_ajolotaryId_fkey" FOREIGN KEY ("ajolotaryId") REFERENCES "Ajolotary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Axolotl" ADD CONSTRAINT "Axolotl_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementRule" ADD CONSTRAINT "MeasurementRule_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AjolotaryToUser" ADD CONSTRAINT "_AjolotaryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ajolotary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AjolotaryToUser" ADD CONSTRAINT "_AjolotaryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeasurementToParameter" ADD CONSTRAINT "_MeasurementToParameter_A_fkey" FOREIGN KEY ("A") REFERENCES "Measurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeasurementToParameter" ADD CONSTRAINT "_MeasurementToParameter_B_fkey" FOREIGN KEY ("B") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
