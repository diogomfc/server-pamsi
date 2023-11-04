/*
  Warnings:

  - Made the column `numero_processo` on table `form5_Motorista` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form5_Motorista" ADD COLUMN     "bairro_motorista" TEXT,
ADD COLUMN     "celular_motorista" TEXT,
ADD COLUMN     "cep_motorista" TEXT,
ADD COLUMN     "cidade_motorista" TEXT,
ADD COLUMN     "cnh_motorista" TEXT,
ADD COLUMN     "complemento_motorista" TEXT,
ADD COLUMN     "consulta_telerisco_motorista" TEXT,
ADD COLUMN     "cpf_motorista" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_consulta_telerisco_motorista" TEXT,
ADD COLUMN     "data_nascimento_motorista" TIMESTAMP(3),
ADD COLUMN     "email_motorista" TEXT,
ADD COLUMN     "endereco_motorista" TEXT,
ADD COLUMN     "local_nascimento_motorista" TEXT,
ADD COLUMN     "nome_motorista" TEXT,
ADD COLUMN     "numero_consulta_telerisco_motorista" TEXT,
ADD COLUMN     "numero_motorista" TEXT,
ADD COLUMN     "telefone_motorista" TEXT,
ADD COLUMN     "tipo_cnh_motorista" TEXT,
ADD COLUMN     "uf_motorista" TEXT,
ADD COLUMN     "validade_cnh_motorista" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
