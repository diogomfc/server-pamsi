/*
  Warnings:

  - Made the column `numero_processo` on table `form11_Declaracao_Motorista_Ajudante` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;
