/*
  Warnings:

  - Made the column `numero_processo` on table `form17_Conclusao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form17_Conclusao" ADD COLUMN     "conclusao_relatorio" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;
