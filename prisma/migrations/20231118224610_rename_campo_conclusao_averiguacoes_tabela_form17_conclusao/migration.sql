/*
  Warnings:

  - You are about to drop the column `conclusao_relatorio` on the `form17_Conclusao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "form17_Conclusao" DROP COLUMN "conclusao_relatorio",
ADD COLUMN     "conclusao_averiguacoes" TEXT;
