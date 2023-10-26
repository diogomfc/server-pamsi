/*
  Warnings:

  - You are about to drop the `form_ajudantes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_anexos_fotograficos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_caracteristica_sinistro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_cliente_segurado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_conclusao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_cronologia_sinistro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_declaracao_motorista_ajudante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_do_carregamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_gerenciamento_risco_deposito` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_gerenciamento_risco_veiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_locais_evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_motorista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_orgao_policial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_recuperacao_carga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_resumo_averiguacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_sistemas_protecao_carregamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_veiculo_transportador` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form11_Declaracao_Motorista_Ajudante_id_fkey";

-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form13_Locais_Evento_id_fkey";

-- DropForeignKey
ALTER TABLE "arquivos" DROP CONSTRAINT "arquivos_form16_Anexos_Fotograficos_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form10_Sistemas_Protecao_Carregam_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form11_Declaracao_Motorista_Ajuda_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposi_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form13_Locais_Evento_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form15_Recuperacao_Carga_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form16_Anexos_Fotograficos_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form17_Conclusao_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form1_Cliente_Segurado_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form3_Cronologia_Sinistro_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form4_Do_Carregamento_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form5_Motorista_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form6_Ajudantes_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form7_Veiculo_Transportador_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form8_Orgao_Policial_id_fkey";

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo_fkey";

-- DropTable
DROP TABLE "form_ajudantes";

-- DropTable
DROP TABLE "form_anexos_fotograficos";

-- DropTable
DROP TABLE "form_caracteristica_sinistro";

-- DropTable
DROP TABLE "form_cliente_segurado";

-- DropTable
DROP TABLE "form_conclusao";

-- DropTable
DROP TABLE "form_cronologia_sinistro";

-- DropTable
DROP TABLE "form_declaracao_motorista_ajudante";

-- DropTable
DROP TABLE "form_do_carregamento";

-- DropTable
DROP TABLE "form_gerenciamento_risco_deposito";

-- DropTable
DROP TABLE "form_gerenciamento_risco_veiculo";

-- DropTable
DROP TABLE "form_locais_evento";

-- DropTable
DROP TABLE "form_motorista";

-- DropTable
DROP TABLE "form_orgao_policial";

-- DropTable
DROP TABLE "form_recuperacao_carga";

-- DropTable
DROP TABLE "form_resumo_averiguacoes";

-- DropTable
DROP TABLE "form_sistemas_protecao_carregamento";

-- DropTable
DROP TABLE "form_veiculo_transportador";

-- CreateTable
CREATE TABLE "form1_Cliente_Segurado" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '1',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',
    "nome_cliente" TEXT,
    "cnpj" TEXT,

    CONSTRAINT "form1_Cliente_Segurado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form2_Caracteristica_Sinistro" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '2',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form2_Caracteristica_Sinistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form3_Cronologia_Sinistro" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '3',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form3_Cronologia_Sinistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form4_Do_Carregamento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '4',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form4_Do_Carregamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form5_Motorista" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '5',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form5_Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form6_Ajudantes" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '6',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form6_Ajudantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form7_Veiculo_Transportador" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '7',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form7_Veiculo_Transportador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form8_Orgao_Policial" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '8',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form8_Orgao_Policial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form9_Gerenciamento_Risco_Veiculo" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '9',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form9_Gerenciamento_Risco_Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form10_Sistemas_Protecao_Carregamento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '10',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form10_Sistemas_Protecao_Carregamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form11_Declaracao_Motorista_Ajudante" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '11',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form11_Declaracao_Motorista_Ajudante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form12_Gerenciamento_Risco_Deposito" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '12',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form12_Gerenciamento_Risco_Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form13_Locais_Evento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '13',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form13_Locais_Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form14_Resumo_Averiguacoes" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '14',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form14_Resumo_Averiguacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form15_Recuperacao_Carga" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '15',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form15_Recuperacao_Carga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form16_Anexos_Fotograficos" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '16',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form16_Anexos_Fotograficos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form17_Conclusao" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '17',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form17_Conclusao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form1_Cliente_Segurado_numero_processo_key" ON "form1_Cliente_Segurado"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form2_Caracteristica_Sinistro_numero_processo_key" ON "form2_Caracteristica_Sinistro"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form3_Cronologia_Sinistro_numero_processo_key" ON "form3_Cronologia_Sinistro"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form4_Do_Carregamento_numero_processo_key" ON "form4_Do_Carregamento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form5_Motorista_numero_processo_key" ON "form5_Motorista"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form6_Ajudantes_numero_processo_key" ON "form6_Ajudantes"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form7_Veiculo_Transportador_numero_processo_key" ON "form7_Veiculo_Transportador"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form8_Orgao_Policial_numero_processo_key" ON "form8_Orgao_Policial"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form9_Gerenciamento_Risco_Veiculo_numero_processo_key" ON "form9_Gerenciamento_Risco_Veiculo"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form10_Sistemas_Protecao_Carregamento_numero_processo_key" ON "form10_Sistemas_Protecao_Carregamento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form11_Declaracao_Motorista_Ajudante_numero_processo_key" ON "form11_Declaracao_Motorista_Ajudante"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form12_Gerenciamento_Risco_Deposito_numero_processo_key" ON "form12_Gerenciamento_Risco_Deposito"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form13_Locais_Evento_numero_processo_key" ON "form13_Locais_Evento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form14_Resumo_Averiguacoes_numero_processo_key" ON "form14_Resumo_Averiguacoes"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form15_Recuperacao_Carga_numero_processo_key" ON "form15_Recuperacao_Carga"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form16_Anexos_Fotograficos_numero_processo_key" ON "form16_Anexos_Fotograficos"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form17_Conclusao_numero_processo_key" ON "form17_Conclusao"("numero_processo");

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form1_Cliente_Segurado_id_fkey" FOREIGN KEY ("form1_Cliente_Segurado_id") REFERENCES "form1_Cliente_Segurado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_fkey" FOREIGN KEY ("form2_Caracteristica_Sinistro_id") REFERENCES "form2_Caracteristica_Sinistro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form3_Cronologia_Sinistro_id_fkey" FOREIGN KEY ("form3_Cronologia_Sinistro_id") REFERENCES "form3_Cronologia_Sinistro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form4_Do_Carregamento_id_fkey" FOREIGN KEY ("form4_Do_Carregamento_id") REFERENCES "form4_Do_Carregamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form5_Motorista_id_fkey" FOREIGN KEY ("form5_Motorista_id") REFERENCES "form5_Motorista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form6_Ajudantes_id_fkey" FOREIGN KEY ("form6_Ajudantes_id") REFERENCES "form6_Ajudantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form7_Veiculo_Transportador_id_fkey" FOREIGN KEY ("form7_Veiculo_Transportador_id") REFERENCES "form7_Veiculo_Transportador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form8_Orgao_Policial_id_fkey" FOREIGN KEY ("form8_Orgao_Policial_id") REFERENCES "form8_Orgao_Policial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo_fkey" FOREIGN KEY ("form9_Gerenciamento_Risco_Veiculo_id") REFERENCES "form9_Gerenciamento_Risco_Veiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form10_Sistemas_Protecao_Carregam_fkey" FOREIGN KEY ("form10_Sistemas_Protecao_Carregamento_id") REFERENCES "form10_Sistemas_Protecao_Carregamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form11_Declaracao_Motorista_Ajuda_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposi_fkey" FOREIGN KEY ("form12_Gerenciamento_Risco_Deposito_id") REFERENCES "form12_Gerenciamento_Risco_Deposito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form13_Locais_Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_fkey" FOREIGN KEY ("form14_Resumo_Averiguacoes_id") REFERENCES "form14_Resumo_Averiguacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form15_Recuperacao_Carga_id_fkey" FOREIGN KEY ("form15_Recuperacao_Carga_id") REFERENCES "form15_Recuperacao_Carga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form16_Anexos_Fotograficos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form17_Conclusao_id_fkey" FOREIGN KEY ("form17_Conclusao_id") REFERENCES "form17_Conclusao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form11_Declaracao_Motorista_Ajudante_id_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form16_Anexos_Fotograficos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form13_Locais_Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
