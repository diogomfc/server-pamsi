/*
  Warnings:

  - You are about to drop the column `formulariosDoRelatorio_id` on the `form10_Sistemas_Protecao_Carregamento` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form11_Declaracao_Motorista_Ajudante` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form12_Gerenciamento_Risco_Deposito` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form13_Locais_Evento` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form14_Resumo_Averiguacoes` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form15_Recuperacao_Carga` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form16_Anexos_Fotograficos` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form17_Conclusao` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form1_Cliente_Segurado` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form2_Caracteristica_Sinistro` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form3_Cronologia_Sinistro` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form4_Do_Carregamento` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form5_Motorista` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form6_Ajudantes` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form7_Veiculo_Transportador` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form8_Orgao_Policial` table. All the data in the column will be lost.
  - You are about to drop the column `formulariosDoRelatorio_id` on the `form9_Gerenciamento_Risco_Veiculo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form10_Sistemas_Protecao_Carregamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form11_Declaracao_Motorista_Ajudante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form12_Gerenciamento_Risco_Deposito` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form13_Locais_Evento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form14_Resumo_Averiguacoes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form15_Recuperacao_Carga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form16_Anexos_Fotograficos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form17_Conclusao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form1_Cliente_Segurado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form2_Caracteristica_Sinistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form3_Cronologia_Sinistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form4_Do_Carregamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form5_Motorista` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form6_Ajudantes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form7_Veiculo_Transportador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form8_Orgao_Policial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formularioDoRelatorio_id]` on the table `form9_Gerenciamento_Risco_Veiculo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formularioDoRelatorio_id` to the `form1_Cliente_Segurado` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" DROP CONSTRAINT "form10_Sistemas_Protecao_Carregamento_formulariosDoRelator_fkey";

-- DropForeignKey
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" DROP CONSTRAINT "form11_Declaracao_Motorista_Ajudante_formulariosDoRelatori_fkey";

-- DropForeignKey
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" DROP CONSTRAINT "form12_Gerenciamento_Risco_Deposito_formulariosDoRelatorio_fkey";

-- DropForeignKey
ALTER TABLE "form13_Locais_Evento" DROP CONSTRAINT "form13_Locais_Evento_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form14_Resumo_Averiguacoes" DROP CONSTRAINT "form14_Resumo_Averiguacoes_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form15_Recuperacao_Carga" DROP CONSTRAINT "form15_Recuperacao_Carga_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form16_Anexos_Fotograficos" DROP CONSTRAINT "form16_Anexos_Fotograficos_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form17_Conclusao" DROP CONSTRAINT "form17_Conclusao_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form1_Cliente_Segurado" DROP CONSTRAINT "form1_Cliente_Segurado_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form2_Caracteristica_Sinistro" DROP CONSTRAINT "form2_Caracteristica_Sinistro_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form3_Cronologia_Sinistro" DROP CONSTRAINT "form3_Cronologia_Sinistro_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form4_Do_Carregamento" DROP CONSTRAINT "form4_Do_Carregamento_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form5_Motorista" DROP CONSTRAINT "form5_Motorista_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form6_Ajudantes" DROP CONSTRAINT "form6_Ajudantes_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form7_Veiculo_Transportador" DROP CONSTRAINT "form7_Veiculo_Transportador_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form8_Orgao_Policial" DROP CONSTRAINT "form8_Orgao_Policial_formulariosDoRelatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" DROP CONSTRAINT "form9_Gerenciamento_Risco_Veiculo_formulariosDoRelatorio_i_fkey";

-- DropIndex
DROP INDEX "form10_Sistemas_Protecao_Carregamento_formulariosDoRelatori_key";

-- DropIndex
DROP INDEX "form11_Declaracao_Motorista_Ajudante_formulariosDoRelatorio_key";

-- DropIndex
DROP INDEX "form12_Gerenciamento_Risco_Deposito_formulariosDoRelatorio__key";

-- DropIndex
DROP INDEX "form13_Locais_Evento_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form14_Resumo_Averiguacoes_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form15_Recuperacao_Carga_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form16_Anexos_Fotograficos_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form17_Conclusao_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form1_Cliente_Segurado_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form2_Caracteristica_Sinistro_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form3_Cronologia_Sinistro_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form4_Do_Carregamento_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form5_Motorista_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form6_Ajudantes_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form7_Veiculo_Transportador_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form8_Orgao_Policial_formulariosDoRelatorio_id_key";

-- DropIndex
DROP INDEX "form9_Gerenciamento_Risco_Veiculo_formulariosDoRelatorio_id_key";

-- AlterTable
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form13_Locais_Evento" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form14_Resumo_Averiguacoes" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form15_Recuperacao_Carga" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form16_Anexos_Fotograficos" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form17_Conclusao" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form1_Cliente_Segurado" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "form2_Caracteristica_Sinistro" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form3_Cronologia_Sinistro" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form4_Do_Carregamento" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form5_Motorista" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form6_Ajudantes" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form7_Veiculo_Transportador" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form8_Orgao_Policial" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" DROP COLUMN "formulariosDoRelatorio_id",
ADD COLUMN     "formularioDoRelatorio_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "form10_Sistemas_Protecao_Carregamento_formularioDoRelatorio_key" ON "form10_Sistemas_Protecao_Carregamento"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form11_Declaracao_Motorista_Ajudante_formularioDoRelatorio__key" ON "form11_Declaracao_Motorista_Ajudante"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form12_Gerenciamento_Risco_Deposito_formularioDoRelatorio_i_key" ON "form12_Gerenciamento_Risco_Deposito"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form13_Locais_Evento_formularioDoRelatorio_id_key" ON "form13_Locais_Evento"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form14_Resumo_Averiguacoes_formularioDoRelatorio_id_key" ON "form14_Resumo_Averiguacoes"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form15_Recuperacao_Carga_formularioDoRelatorio_id_key" ON "form15_Recuperacao_Carga"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form16_Anexos_Fotograficos_formularioDoRelatorio_id_key" ON "form16_Anexos_Fotograficos"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form17_Conclusao_formularioDoRelatorio_id_key" ON "form17_Conclusao"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form1_Cliente_Segurado_formularioDoRelatorio_id_key" ON "form1_Cliente_Segurado"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form2_Caracteristica_Sinistro_formularioDoRelatorio_id_key" ON "form2_Caracteristica_Sinistro"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form3_Cronologia_Sinistro_formularioDoRelatorio_id_key" ON "form3_Cronologia_Sinistro"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form4_Do_Carregamento_formularioDoRelatorio_id_key" ON "form4_Do_Carregamento"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form5_Motorista_formularioDoRelatorio_id_key" ON "form5_Motorista"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form6_Ajudantes_formularioDoRelatorio_id_key" ON "form6_Ajudantes"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form7_Veiculo_Transportador_formularioDoRelatorio_id_key" ON "form7_Veiculo_Transportador"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form8_Orgao_Policial_formularioDoRelatorio_id_key" ON "form8_Orgao_Policial"("formularioDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form9_Gerenciamento_Risco_Veiculo_formularioDoRelatorio_id_key" ON "form9_Gerenciamento_Risco_Veiculo"("formularioDoRelatorio_id");

-- AddForeignKey
ALTER TABLE "form1_Cliente_Segurado" ADD CONSTRAINT "form1_Cliente_Segurado_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form2_Caracteristica_Sinistro" ADD CONSTRAINT "form2_Caracteristica_Sinistro_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form3_Cronologia_Sinistro" ADD CONSTRAINT "form3_Cronologia_Sinistro_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form4_Do_Carregamento" ADD CONSTRAINT "form4_Do_Carregamento_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form5_Motorista" ADD CONSTRAINT "form5_Motorista_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form6_Ajudantes" ADD CONSTRAINT "form6_Ajudantes_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form7_Veiculo_Transportador" ADD CONSTRAINT "form7_Veiculo_Transportador_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form8_Orgao_Policial" ADD CONSTRAINT "form8_Orgao_Policial_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" ADD CONSTRAINT "form9_Gerenciamento_Risco_Veiculo_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" ADD CONSTRAINT "form10_Sistemas_Protecao_Carregamento_formularioDoRelatori_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" ADD CONSTRAINT "form11_Declaracao_Motorista_Ajudante_formularioDoRelatorio_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" ADD CONSTRAINT "form12_Gerenciamento_Risco_Deposito_formularioDoRelatorio__fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form13_Locais_Evento" ADD CONSTRAINT "form13_Locais_Evento_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form14_Resumo_Averiguacoes" ADD CONSTRAINT "form14_Resumo_Averiguacoes_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form15_Recuperacao_Carga" ADD CONSTRAINT "form15_Recuperacao_Carga_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form16_Anexos_Fotograficos" ADD CONSTRAINT "form16_Anexos_Fotograficos_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form17_Conclusao" ADD CONSTRAINT "form17_Conclusao_formularioDoRelatorio_id_fkey" FOREIGN KEY ("formularioDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
