/*
  Warnings:

  - Added the required column `carga_embarcada` to the `form2_Caracteristica_Sinistro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_seguradora` to the `form2_Caracteristica_Sinistro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_carga` to the `form2_Caracteristica_Sinistro` table without a default value. This is not possible if the table is not empty.
  - Made the column `numero_processo` on table `form2_Caracteristica_Sinistro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form2_Caracteristica_Sinistro" ADD COLUMN     "carga_embarcada" TEXT NOT NULL,
ADD COLUMN     "data_cadastro" TEXT,
ADD COLUMN     "natureza_sinistro" "Natureza_Sinistro" NOT NULL DEFAULT 'Roubo',
ADD COLUMN     "nome_seguradora" TEXT NOT NULL,
ADD COLUMN     "valor_carga" TEXT NOT NULL,
ALTER COLUMN "numero_processo" SET NOT NULL;
