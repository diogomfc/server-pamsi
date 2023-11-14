/*
  Warnings:

  - You are about to drop the column `file_declaracao_ajudante` on the `form11_Declaracao_Motorista_Ajudante` table. All the data in the column will be lost.
  - You are about to drop the column `file_declaracao_motorista` on the `form11_Declaracao_Motorista_Ajudante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" DROP COLUMN "file_declaracao_ajudante",
DROP COLUMN "file_declaracao_motorista",
ADD COLUMN     "arquivos_declaracoes" TEXT[] DEFAULT ARRAY[]::TEXT[];
