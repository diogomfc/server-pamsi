/*
  Warnings:

  - Made the column `numero_processo` on table `form3_Cronologia_Sinistro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form3_Cronologia_Sinistro" ADD COLUMN     "agente_pamcary" TEXT,
ADD COLUMN     "bairro_local_sinistro" TEXT,
ADD COLUMN     "cep_local_sinistro" TEXT,
ADD COLUMN     "cidade_local_sinistro" TEXT,
ADD COLUMN     "complemento_local_sinistro" TEXT,
ADD COLUMN     "comunicante" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_hora_chegada_local" TEXT,
ADD COLUMN     "data_hora_comunicacao" TEXT,
ADD COLUMN     "data_hora_sinistro" TEXT,
ADD COLUMN     "endereco_local_sinistro" TEXT,
ADD COLUMN     "numero_local_sinistro" TEXT,
ADD COLUMN     "uf_local_sinistro" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
