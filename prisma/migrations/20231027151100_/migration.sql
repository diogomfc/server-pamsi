/*
  Warnings:

  - Made the column `data_entrada` on table `relatorios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "relatorios" ALTER COLUMN "data_entrada" SET NOT NULL,
ALTER COLUMN "data_entrada" SET DEFAULT CURRENT_TIMESTAMP;
