/*
  Warnings:

  - Added the required column `bairro` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `celular` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complemento` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `representante` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.
  - Made the column `numero_processo` on table `form1_Cliente_Segurado` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome_cliente` on table `form1_Cliente_Segurado` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnpj` on table `form1_Cliente_Segurado` required. This step will fail if there are existing NULL values in that column.
  - Made the column `formulariosDoRelatorio_id` on table `form1_Cliente_Segurado` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form1_Cliente_Segurado" ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "celular" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "representante" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL,
ALTER COLUMN "numero_processo" SET NOT NULL,
ALTER COLUMN "nome_cliente" SET NOT NULL,
ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "formulariosDoRelatorio_id" SET NOT NULL;
