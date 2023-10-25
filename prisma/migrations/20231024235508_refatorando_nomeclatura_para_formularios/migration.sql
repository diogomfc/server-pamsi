/*
  Warnings:

  - You are about to drop the column `declaracaoMotoristaAjudanteId` on the `arquivos` table. All the data in the column will be lost.
  - You are about to drop the column `criador_id` on the `relatorios` table. All the data in the column will be lost.
  - You are about to drop the `clientes_segurados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `declaracoes_motorista_ajudante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etapas_relatorios` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numero_processo]` on the table `arquivos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioResponsavel_id` to the `relatorios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoFormulario" AS ENUM ('stepClienteSegurado', 'stepDeclaracaoMotoristaAjudante');

-- CreateEnum
CREATE TYPE "StatusFormulario" AS ENUM ('Pendente', 'Formalizando', 'Finalizado', 'Aprovado', 'Corrigir', 'Rejeitado');

-- AlterEnum
ALTER TYPE "StatusRelatorio" ADD VALUE 'Emitido';

-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_declaracaoMotoristaAjudanteId_fkey";

-- DropForeignKey
ALTER TABLE "etapas_relatorios" DROP CONSTRAINT "etapas_relatorios_clienteSeguradoId_fkey";

-- DropForeignKey
ALTER TABLE "etapas_relatorios" DROP CONSTRAINT "etapas_relatorios_declaracaoMotoristaAjudanteId_fkey";

-- DropForeignKey
ALTER TABLE "etapas_relatorios" DROP CONSTRAINT "etapas_relatorios_relatorioId_fkey";

-- DropForeignKey
ALTER TABLE "relatorios" DROP CONSTRAINT "relatorios_criador_id_fkey";

-- AlterTable
ALTER TABLE "arquivos" DROP COLUMN "declaracaoMotoristaAjudanteId",
ADD COLUMN     "formDeclaracaoMotoristaAjudante_id" TEXT;

-- AlterTable
ALTER TABLE "relatorios" DROP COLUMN "criador_id",
ADD COLUMN     "usuarioResponsavel_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "clientes_segurados";

-- DropTable
DROP TABLE "declaracoes_motorista_ajudante";

-- DropTable
DROP TABLE "etapas_relatorios";

-- DropEnum
DROP TYPE "StatusEtapa";

-- DropEnum
DROP TYPE "TipoEtapa";

-- CreateTable
CREATE TABLE "formularios_do_relatorio" (
    "id" TEXT NOT NULL,
    "tipoFormulario" "TipoFormulario" NOT NULL,
    "statusFormulario" "StatusFormulario" NOT NULL,
    "numeroProcesso" TEXT,
    "formClienteSegurado_id" TEXT,
    "formDeclaracaoMotoristaAjudante_id" TEXT,
    "relatorio_id" TEXT NOT NULL,

    CONSTRAINT "formularios_do_relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_cliente_segurado" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '1',
    "status" "StatusFormulario"[],
    "nomeCliente" TEXT,
    "cnpj" TEXT,
    "numero_processo" TEXT,

    CONSTRAINT "form_cliente_segurado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_declaracao_motorista_ajudante" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '11',
    "status" "StatusFormulario"[],
    "numero_processo" TEXT,

    CONSTRAINT "form_declaracao_motorista_ajudante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_numeroProcesso_key" ON "formularios_do_relatorio"("numeroProcesso");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_formClienteSegurado_id_key" ON "formularios_do_relatorio"("formClienteSegurado_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_formDeclaracaoMotoristaAjudante_id_key" ON "formularios_do_relatorio"("formDeclaracaoMotoristaAjudante_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_cliente_segurado_numero_processo_key" ON "form_cliente_segurado"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_declaracao_motorista_ajudante_numero_processo_key" ON "form_declaracao_motorista_ajudante"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_numero_processo_key" ON "arquivos"("numero_processo");

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_usuarioResponsavel_id_fkey" FOREIGN KEY ("usuarioResponsavel_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_formClienteSegurado_id_fkey" FOREIGN KEY ("formClienteSegurado_id") REFERENCES "form_cliente_segurado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_formDeclaracaoMotoristaAjudante_i_fkey" FOREIGN KEY ("formDeclaracaoMotoristaAjudante_id") REFERENCES "form_declaracao_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_relatorio_id_fkey" FOREIGN KEY ("relatorio_id") REFERENCES "relatorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_formDeclaracaoMotoristaAjudante_id_fkey" FOREIGN KEY ("formDeclaracaoMotoristaAjudante_id") REFERENCES "form_declaracao_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
