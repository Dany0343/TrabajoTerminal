/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Parameter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Parameter_name_key" ON "Parameter"("name");
