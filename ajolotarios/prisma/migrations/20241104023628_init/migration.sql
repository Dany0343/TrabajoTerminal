-- AlterTable
ALTER TABLE "Sensor" ALTER COLUMN "lastConnection" DROP NOT NULL,
ALTER COLUMN "calibratedAt" DROP NOT NULL;
