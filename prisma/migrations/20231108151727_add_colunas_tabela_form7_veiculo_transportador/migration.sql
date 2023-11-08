/*
  Warnings:

  - Made the column `numero_processo` on table `form7_Veiculo_Transportador` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form7_Veiculo_Transportador" ADD COLUMN     "ano_fabricacao_carreta" TEXT,
ADD COLUMN     "ano_fabricacao_cavalo_mecanico" TEXT,
ADD COLUMN     "ano_modelo_carreta" TEXT,
ADD COLUMN     "ano_modelo_cavalo_mecanico" TEXT,
ADD COLUMN     "chassi_carreta" TEXT,
ADD COLUMN     "chassi_cavalo_mecanico" TEXT,
ADD COLUMN     "cor_carreta" TEXT,
ADD COLUMN     "cor_cavalo_mecanico" TEXT,
ADD COLUMN     "cpf_cnpj_proprietario_carreta" TEXT,
ADD COLUMN     "cpf_cnpj_proprietario_cavalo_mecanico" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "marca_carreta" TEXT,
ADD COLUMN     "marca_cavalo_mecanico" TEXT,
ADD COLUMN     "modelo_carreta" TEXT,
ADD COLUMN     "modelo_cavalo_mecanico" TEXT,
ADD COLUMN     "placa_carreta" TEXT,
ADD COLUMN     "placa_cavalo_mecanico" TEXT,
ADD COLUMN     "proprietario_carreta" TEXT,
ADD COLUMN     "proprietario_cavalo_mecanico" TEXT,
ADD COLUMN     "renavam_carreta" TEXT,
ADD COLUMN     "renavam_cavalo_mecanico" TEXT,
ADD COLUMN     "uf_carreta" TEXT,
ADD COLUMN     "uf_cavalo_mecanico" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
