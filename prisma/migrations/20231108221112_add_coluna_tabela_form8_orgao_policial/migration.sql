/*
  Warnings:

  - Made the column `numero_processo` on table `form8_Orgao_Policial` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form8_Orgao_Policial" ADD COLUMN     "bairro_delegacia" TEXT,
ADD COLUMN     "cep_delegacia" TEXT,
ADD COLUMN     "cidade_delegacia" TEXT,
ADD COLUMN     "data_bo" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_ip" TEXT,
ADD COLUMN     "delegacia" TEXT,
ADD COLUMN     "endereco_delegacia" TEXT,
ADD COLUMN     "numero_bo" TEXT,
ADD COLUMN     "numero_delegacia" TEXT,
ADD COLUMN     "numero_ip" TEXT,
ADD COLUMN     "telefone_delegacia" TEXT,
ADD COLUMN     "uf_delegacia" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
