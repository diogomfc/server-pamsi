/*
  Warnings:

  - A unique constraint covering the columns `[relatorio_id]` on the table `arquivos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relatorio_id` to the `arquivos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "arquivos" ADD COLUMN     "relatorio_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_relatorio_id_key" ON "arquivos"("relatorio_id");
