/*
  Warnings:

  - You are about to drop the column `arquivos_declaracoes` on the `form11_Declaracao_Motorista_Ajudante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" DROP COLUMN "arquivos_declaracoes";

-- CreateTable
CREATE TABLE "_arquivos_declaracoes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_arquivos_declaracoes_AB_unique" ON "_arquivos_declaracoes"("A", "B");

-- CreateIndex
CREATE INDEX "_arquivos_declaracoes_B_index" ON "_arquivos_declaracoes"("B");

-- AddForeignKey
ALTER TABLE "_arquivos_declaracoes" ADD CONSTRAINT "_arquivos_declaracoes_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_arquivos_declaracoes" ADD CONSTRAINT "_arquivos_declaracoes_B_fkey" FOREIGN KEY ("B") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
