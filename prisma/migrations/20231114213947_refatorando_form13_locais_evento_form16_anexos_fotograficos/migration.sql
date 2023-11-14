/*
  Warnings:

  - Made the column `numero_processo` on table `form13_Locais_Evento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero_processo` on table `form16_Anexos_Fotograficos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form13_Locais_Evento" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;

-- AlterTable
ALTER TABLE "form16_Anexos_Fotograficos" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "numero_processo" SET NOT NULL;

-- CreateTable
CREATE TABLE "_fotos_local_da_Abordagem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_anexos_fotograficos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_da_Abordagem_AB_unique" ON "_fotos_local_da_Abordagem"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_da_Abordagem_B_index" ON "_fotos_local_da_Abordagem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_anexos_fotograficos_AB_unique" ON "_anexos_fotograficos"("A", "B");

-- CreateIndex
CREATE INDEX "_anexos_fotograficos_B_index" ON "_anexos_fotograficos"("B");

-- AddForeignKey
ALTER TABLE "_fotos_local_da_Abordagem" ADD CONSTRAINT "_fotos_local_da_Abordagem_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_da_Abordagem" ADD CONSTRAINT "_fotos_local_da_Abordagem_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anexos_fotograficos" ADD CONSTRAINT "_anexos_fotograficos_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anexos_fotograficos" ADD CONSTRAINT "_anexos_fotograficos_B_fkey" FOREIGN KEY ("B") REFERENCES "form16_Anexos_Fotograficos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
