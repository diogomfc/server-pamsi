/*
  Warnings:

  - You are about to drop the `_arquivos_declaracoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_fotos_local_da_Abordagem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_fotos_local_da_cativeiro_Abandono_do_Motorista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_fotos_local_de_Encontro_do_Veiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_fotos_local_de_Recuperacao_da_Carga` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_arquivos_declaracoes" DROP CONSTRAINT "_arquivos_declaracoes_A_fkey";

-- DropForeignKey
ALTER TABLE "_arquivos_declaracoes" DROP CONSTRAINT "_arquivos_declaracoes_B_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_da_Abordagem" DROP CONSTRAINT "_fotos_local_da_Abordagem_A_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_da_Abordagem" DROP CONSTRAINT "_fotos_local_da_Abordagem_B_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista" DROP CONSTRAINT "_fotos_local_da_cativeiro_Abandono_do_Motorista_A_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista" DROP CONSTRAINT "_fotos_local_da_cativeiro_Abandono_do_Motorista_B_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_de_Encontro_do_Veiculo" DROP CONSTRAINT "_fotos_local_de_Encontro_do_Veiculo_A_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_de_Encontro_do_Veiculo" DROP CONSTRAINT "_fotos_local_de_Encontro_do_Veiculo_B_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_de_Recuperacao_da_Carga" DROP CONSTRAINT "_fotos_local_de_Recuperacao_da_Carga_A_fkey";

-- DropForeignKey
ALTER TABLE "_fotos_local_de_Recuperacao_da_Carga" DROP CONSTRAINT "_fotos_local_de_Recuperacao_da_Carga_B_fkey";

-- DropTable
DROP TABLE "_arquivos_declaracoes";

-- DropTable
DROP TABLE "_fotos_local_da_Abordagem";

-- DropTable
DROP TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista";

-- DropTable
DROP TABLE "_fotos_local_de_Encontro_do_Veiculo";

-- DropTable
DROP TABLE "_fotos_local_de_Recuperacao_da_Carga";

-- CreateTable
CREATE TABLE "_declaracao_motorista_ajudante" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_da_abordagem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_de_cativeiro_e_abandono_do_motorista" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_de_encontro_do_veiculo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_de_recuperacao_da_carga" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_declaracao_motorista_ajudante_AB_unique" ON "_declaracao_motorista_ajudante"("A", "B");

-- CreateIndex
CREATE INDEX "_declaracao_motorista_ajudante_B_index" ON "_declaracao_motorista_ajudante"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_da_abordagem_AB_unique" ON "_fotos_local_da_abordagem"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_da_abordagem_B_index" ON "_fotos_local_da_abordagem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_de_cativeiro_e_abandono_do_motorista_AB_unique" ON "_fotos_local_de_cativeiro_e_abandono_do_motorista"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_de_cativeiro_e_abandono_do_motorista_B_index" ON "_fotos_local_de_cativeiro_e_abandono_do_motorista"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_de_encontro_do_veiculo_AB_unique" ON "_fotos_local_de_encontro_do_veiculo"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_de_encontro_do_veiculo_B_index" ON "_fotos_local_de_encontro_do_veiculo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_de_recuperacao_da_carga_AB_unique" ON "_fotos_local_de_recuperacao_da_carga"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_de_recuperacao_da_carga_B_index" ON "_fotos_local_de_recuperacao_da_carga"("B");

-- AddForeignKey
ALTER TABLE "_declaracao_motorista_ajudante" ADD CONSTRAINT "_declaracao_motorista_ajudante_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_declaracao_motorista_ajudante" ADD CONSTRAINT "_declaracao_motorista_ajudante_B_fkey" FOREIGN KEY ("B") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_da_abordagem" ADD CONSTRAINT "_fotos_local_da_abordagem_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_da_abordagem" ADD CONSTRAINT "_fotos_local_da_abordagem_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_cativeiro_e_abandono_do_motorista" ADD CONSTRAINT "_fotos_local_de_cativeiro_e_abandono_do_motorista_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_cativeiro_e_abandono_do_motorista" ADD CONSTRAINT "_fotos_local_de_cativeiro_e_abandono_do_motorista_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_encontro_do_veiculo" ADD CONSTRAINT "_fotos_local_de_encontro_do_veiculo_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_encontro_do_veiculo" ADD CONSTRAINT "_fotos_local_de_encontro_do_veiculo_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_recuperacao_da_carga" ADD CONSTRAINT "_fotos_local_de_recuperacao_da_carga_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_recuperacao_da_carga" ADD CONSTRAINT "_fotos_local_de_recuperacao_da_carga_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
