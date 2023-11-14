/*
  Warnings:

  - You are about to drop the column `form11DeclaracaoMotoristaAjudante_id` on the `arquivos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form11DeclaracaoMotoristaAjudante_id_fkey";

-- DropIndex
DROP INDEX "arquivos_form_id_key";

-- DropIndex
DROP INDEX "arquivos_form_nome_key";

-- DropIndex
DROP INDEX "arquivos_numero_processo_key";

-- DropIndex
DROP INDEX "arquivos_relatorio_id_key";

-- AlterTable
ALTER TABLE "arquivos" DROP COLUMN "form11DeclaracaoMotoristaAjudante_id";
