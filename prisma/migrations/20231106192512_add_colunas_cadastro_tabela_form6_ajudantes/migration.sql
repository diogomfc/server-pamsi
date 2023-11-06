/*
  Warnings:

  - Made the column `numero_processo` on table `form6_Ajudantes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form5_Motorista" ADD COLUMN     "vinculo_motorista_empresa" TEXT;

-- AlterTable
ALTER TABLE "form6_Ajudantes" ADD COLUMN     "bairro_ajudante" TEXT,
ADD COLUMN     "celular_ajudante" TEXT,
ADD COLUMN     "cep_ajudante" TEXT,
ADD COLUMN     "cidade_ajudante" TEXT,
ADD COLUMN     "cnh_ajudante" TEXT,
ADD COLUMN     "complemento_ajudante" TEXT,
ADD COLUMN     "cpf_ajudante" TEXT,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_nascimento_ajudante" TIMESTAMP(3),
ADD COLUMN     "email_ajudante" TEXT,
ADD COLUMN     "endereco_ajudante" TEXT,
ADD COLUMN     "local_nascimento_ajudante" TEXT,
ADD COLUMN     "nome_ajudante" TEXT,
ADD COLUMN     "numero_ajudante" TEXT,
ADD COLUMN     "telefone_ajudante" TEXT,
ADD COLUMN     "tipo_cnh_ajudante" TEXT,
ADD COLUMN     "uf_ajudante" TEXT,
ADD COLUMN     "validade_cnh_ajudante" TEXT,
ADD COLUMN     "vinculo_ajudante_empresa" TEXT,
ALTER COLUMN "numero_processo" SET NOT NULL;
