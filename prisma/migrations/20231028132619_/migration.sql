/*
  Warnings:

  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form10_Sistemas_Protecao_Carregamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form11_Declaracao_Motorista_Ajudante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form12_Gerenciamento_Risco_Deposito` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form13_Locais_Evento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form14_Resumo_Averiguacoes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form15_Recuperacao_Carga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form16_Anexos_Fotograficos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form17_Conclusao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form1_Cliente_Segurado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form2_Caracteristica_Sinistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form3_Cronologia_Sinistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form4_Do_Carregamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form5_Motorista` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form6_Ajudantes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form7_Veiculo_Transportador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form8_Orgao_Policial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formulariosDoRelatorio_id]` on the table `form9_Gerenciamento_Risco_Veiculo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form13_Locais_Evento" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form14_Resumo_Averiguacoes" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form15_Recuperacao_Carga" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form16_Anexos_Fotograficos" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form17_Conclusao" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form1_Cliente_Segurado" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form2_Caracteristica_Sinistro" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form3_Cronologia_Sinistro" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form4_Do_Carregamento" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form5_Motorista" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form6_Ajudantes" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form7_Veiculo_Transportador" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form8_Orgao_Policial" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- AlterTable
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" ADD COLUMN     "formulariosDoRelatorio_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "form10_Sistemas_Protecao_Carregamento_formulariosDoRelatori_key" ON "form10_Sistemas_Protecao_Carregamento"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form11_Declaracao_Motorista_Ajudante_formulariosDoRelatorio_key" ON "form11_Declaracao_Motorista_Ajudante"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form12_Gerenciamento_Risco_Deposito_formulariosDoRelatorio__key" ON "form12_Gerenciamento_Risco_Deposito"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form13_Locais_Evento_formulariosDoRelatorio_id_key" ON "form13_Locais_Evento"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form14_Resumo_Averiguacoes_formulariosDoRelatorio_id_key" ON "form14_Resumo_Averiguacoes"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form15_Recuperacao_Carga_formulariosDoRelatorio_id_key" ON "form15_Recuperacao_Carga"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form16_Anexos_Fotograficos_formulariosDoRelatorio_id_key" ON "form16_Anexos_Fotograficos"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form17_Conclusao_formulariosDoRelatorio_id_key" ON "form17_Conclusao"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form1_Cliente_Segurado_formulariosDoRelatorio_id_key" ON "form1_Cliente_Segurado"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form2_Caracteristica_Sinistro_formulariosDoRelatorio_id_key" ON "form2_Caracteristica_Sinistro"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form3_Cronologia_Sinistro_formulariosDoRelatorio_id_key" ON "form3_Cronologia_Sinistro"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form4_Do_Carregamento_formulariosDoRelatorio_id_key" ON "form4_Do_Carregamento"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form5_Motorista_formulariosDoRelatorio_id_key" ON "form5_Motorista"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form6_Ajudantes_formulariosDoRelatorio_id_key" ON "form6_Ajudantes"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form7_Veiculo_Transportador_formulariosDoRelatorio_id_key" ON "form7_Veiculo_Transportador"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form8_Orgao_Policial_formulariosDoRelatorio_id_key" ON "form8_Orgao_Policial"("formulariosDoRelatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form9_Gerenciamento_Risco_Veiculo_formulariosDoRelatorio_id_key" ON "form9_Gerenciamento_Risco_Veiculo"("formulariosDoRelatorio_id");
