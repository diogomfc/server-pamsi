/*
  Warnings:

  - Added the required column `natureza_sinistro` to the `relatorios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Natureza_Sinistro" AS ENUM ('Roubo', 'Furto', 'Apreensao', 'Outros');

-- AlterTable
ALTER TABLE "relatorios" ADD COLUMN     "fato_gerador_recuperacao_carga" TEXT,
ADD COLUMN     "natureza_sinistro" "Natureza_Sinistro" NOT NULL,
ADD COLUMN     "status_recuperacao_carga" TEXT;
