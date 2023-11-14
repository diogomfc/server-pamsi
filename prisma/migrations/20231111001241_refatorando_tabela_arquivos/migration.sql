/*
  Warnings:

  - You are about to drop the column `chave` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `form11_Declaracao_Motorista_Ajudante_id` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `form13_Locais_Evento_id` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `form16_Anexos_Fotograficos_id` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `localizacao` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho` on the `arquivos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[form_id]` on the table `arquivos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[form_nome]` on the table `arquivos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `arquivo_chave` to the `arquivos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arquivo_localizacao` to the `arquivos` table without a default value. This is not possible if the table is not empty.
  - Made the column `numero_processo` on table `form12_Gerenciamento_Risco_Deposito` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form11_Declaracao_Motorista_Ajudante_id_fkey";

-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form13_Locais_Evento_id_fkey";

-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form16_Anexos_Fotograficos_id_fkey";

-- AlterTable
ALTER TABLE "arquivos" DROP COLUMN "chave",
DROP COLUMN "form11_Declaracao_Motorista_Ajudante_id",
DROP COLUMN "form13_Locais_Evento_id",
DROP COLUMN "form16_Anexos_Fotograficos_id",
DROP COLUMN "localizacao",
DROP COLUMN "nome",
DROP COLUMN "tamanho",
ADD COLUMN     "arquivo_chave" TEXT NOT NULL,
ADD COLUMN     "arquivo_localizacao" TEXT NOT NULL,
ADD COLUMN     "arquivo_nome" TEXT,
ADD COLUMN     "arquivo_tamanho" INTEGER,
ADD COLUMN     "form_id" TEXT,
ADD COLUMN     "form_nome" TEXT;

-- AlterTable
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_form_id_key" ON "arquivos"("form_id");

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_form_nome_key" ON "arquivos"("form_nome");
