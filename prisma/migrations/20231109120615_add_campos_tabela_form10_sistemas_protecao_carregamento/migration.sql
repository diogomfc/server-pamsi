/*
  Warnings:

  - Made the column `numero_processo` on table `form10_Sistemas_Protecao_Carregamento` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "protecao_comboio" BOOLEAN DEFAULT false,
ADD COLUMN     "protecao_escolta" BOOLEAN DEFAULT false,
ADD COLUMN     "protecao_outros" BOOLEAN DEFAULT false,
ADD COLUMN     "protecao_veiculos" TEXT,
ADD COLUMN     "protecao_velada" BOOLEAN DEFAULT false,
ALTER COLUMN "numero_processo" SET NOT NULL;
