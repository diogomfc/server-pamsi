/*
  Warnings:

  - Made the column `numero_processo` on table `form14_Resumo_Averiguacoes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form14_Resumo_Averiguacoes" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resumo_averiguacoes" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
