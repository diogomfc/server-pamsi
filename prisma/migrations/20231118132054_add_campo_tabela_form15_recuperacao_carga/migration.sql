/*
  Warnings:

  - Made the column `numero_processo` on table `form15_Recuperacao_Carga` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form15_Recuperacao_Carga" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fato_gerador_recuperacao_carga" TEXT,
ADD COLUMN     "recuperacao_carga_parcial" BOOLEAN DEFAULT false,
ADD COLUMN     "recuperacao_carga_recuperada" BOOLEAN DEFAULT false,
ALTER COLUMN "numero_processo" SET NOT NULL;
