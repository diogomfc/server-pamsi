/*
  Warnings:

  - Made the column `numero_processo` on table `form4_Do_Carregamento` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form4_Do_Carregamento" ADD COLUMN     "bairro_destino" TEXT,
ADD COLUMN     "bairro_origem" TEXT,
ADD COLUMN     "cep_destino" TEXT,
ADD COLUMN     "cep_origem" TEXT,
ADD COLUMN     "cidade_destino" TEXT,
ADD COLUMN     "cidade_origem" TEXT,
ADD COLUMN     "complemento_destino" TEXT,
ADD COLUMN     "complemento_origem" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "destinatario" TEXT,
ADD COLUMN     "endereco_destino" TEXT,
ADD COLUMN     "endereco_origem" TEXT,
ADD COLUMN     "manifesto" TEXT,
ADD COLUMN     "numero_crtc_dacte" TEXT,
ADD COLUMN     "numero_destino" TEXT,
ADD COLUMN     "numero_nota_fiscal" TEXT,
ADD COLUMN     "numero_origem" TEXT,
ADD COLUMN     "remetente" TEXT,
ADD COLUMN     "transportadora" TEXT,
ADD COLUMN     "uf_destino" TEXT,
ADD COLUMN     "uf_origem" TEXT,
ADD COLUMN     "valor_embarcado" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
