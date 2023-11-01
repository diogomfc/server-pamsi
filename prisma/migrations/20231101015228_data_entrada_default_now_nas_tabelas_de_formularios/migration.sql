/*
  Warnings:

  - You are about to drop the column `data_cadastro` on the `form1_Cliente_Segurado` table. All the data in the column will be lost.
  - You are about to drop the column `data_cadastro` on the `form2_Caracteristica_Sinistro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "form1_Cliente_Segurado" DROP COLUMN "data_cadastro",
ADD COLUMN     "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "form2_Caracteristica_Sinistro" DROP COLUMN "data_cadastro",
ADD COLUMN     "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
