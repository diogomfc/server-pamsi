/*
  Warnings:

  - Made the column `numero_processo` on table `arquivos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "arquivos" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;
