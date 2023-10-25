-- CreateEnum
CREATE TYPE "FuncaoUsuario" AS ENUM ('Admin', 'Analista', 'Supervisor', 'Revisor');

-- CreateEnum
CREATE TYPE "Status_Relatorio" AS ENUM ('Formalizando', 'Finalizado', 'Aprovado', 'Rejeitado', 'Emitido');

-- CreateEnum
CREATE TYPE "Tipo_Formulario" AS ENUM ('form_1_cliente_segurado', 'form_2_caracteristica_sinistro', 'form_3_cronologia_sinistro', 'form_4_do_carregamento', 'form_5_motorista', 'form_6_ajudantes', 'form_7_veiculo_transportador', 'form_8_orgao_policial', 'form_9_gerenciamento_risco_veiculo', 'form_10_sistemas_protecao_carregamento', 'form_11_declaracao_motorista_ajudante', 'form_12_gerenciamento_risco_deposito', 'form_13_locais_evento', 'form_14_resumo_averiguacoes', 'form_15_recuperacao_carga', 'form_16_anexos_fotograficos', 'form_17_conclusao');

-- CreateEnum
CREATE TYPE "Status_Formulario" AS ENUM ('Pendente', 'Formalizando', 'Finalizado', 'Aprovado', 'Corrigir', 'Rejeitado');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "funcao" "FuncaoUsuario" NOT NULL DEFAULT 'Analista',
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokensAtualizacao" (
    "id" TEXT NOT NULL,
    "expira_em" INTEGER NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokensAtualizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios" (
    "id" TEXT NOT NULL,
    "numero_processo" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_emissao" TIMESTAMP(3),
    "status" "Status_Relatorio" NOT NULL DEFAULT 'Formalizando',
    "usuario_responsavel_id" TEXT NOT NULL,
    "formularios_selecionados" "Tipo_Formulario"[],

    CONSTRAINT "relatorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formularios_do_relatorio" (
    "id" TEXT NOT NULL,
    "numero_processo" TEXT,
    "form1_Cliente_Segurado_id" TEXT,
    "form2_Caracteristica_Sinistro_id" TEXT,
    "form3_Cronologia_Sinistro_id" TEXT,
    "form4_Do_Carregamento_id" TEXT,
    "form5_Motorista_id" TEXT,
    "form6_Ajudantes_id" TEXT,
    "form7_Veiculo_Transportador_id" TEXT,
    "form8_Orgao_Policial_id" TEXT,
    "form9_Gerenciamento_Risco_Veiculo_id" TEXT,
    "form10_Sistemas_Protecao_Carregamento_id" TEXT,
    "form11_Declaracao_Motorista_Ajudante_id" TEXT,
    "form12_Gerenciamento_Risco_Deposito_id" TEXT,
    "form13_Locais_Evento_id" TEXT,
    "form14_Resumo_Averiguacoes_id" TEXT,
    "form15_Recuperacao_Carga_id" TEXT,
    "form16_Anexos_Fotograficos_id" TEXT,
    "form17_Conclusao_id" TEXT,
    "relatorio_id" TEXT NOT NULL,

    CONSTRAINT "formularios_do_relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_cliente_segurado" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '1',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',
    "nome_cliente" TEXT,
    "cnpj" TEXT,

    CONSTRAINT "form_cliente_segurado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_caracteristica_sinistro" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '2',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_caracteristica_sinistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_cronologia_sinistro" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '3',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_cronologia_sinistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_do_carregamento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '4',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_do_carregamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_motorista" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '5',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_ajudantes" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '6',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_ajudantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_veiculo_transportador" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '7',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_veiculo_transportador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_orgao_policial" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '8',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_orgao_policial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_gerenciamento_risco_veiculo" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '9',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_gerenciamento_risco_veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_sistemas_protecao_carregamento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '10',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_sistemas_protecao_carregamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_declaracao_motorista_ajudante" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '11',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_declaracao_motorista_ajudante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_gerenciamento_risco_deposito" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '12',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_gerenciamento_risco_deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_locais_evento" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '13',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_locais_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_resumo_averiguacoes" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '14',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_resumo_averiguacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_recuperacao_carga" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '15',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_recuperacao_carga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_anexos_fotograficos" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '16',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_anexos_fotograficos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_conclusao" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '17',
    "numero_processo" TEXT,
    "status" "Status_Formulario" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "form_conclusao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "tamanho" INTEGER,
    "chave" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "numero_processo" TEXT,
    "form11_Declaracao_Motorista_Ajudante_id" TEXT,
    "form16_Anexos_Fotograficos_id" TEXT,
    "form13_Locais_Evento_id" TEXT,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Usuarios_Permitidos_Para_Relatorio" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokensAtualizacao_usuario_id_key" ON "tokensAtualizacao"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "relatorios_numero_processo_key" ON "relatorios"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_numero_processo_key" ON "formularios_do_relatorio"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form1_Cliente_Segurado_id_key" ON "formularios_do_relatorio"("form1_Cliente_Segurado_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_key" ON "formularios_do_relatorio"("form2_Caracteristica_Sinistro_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form3_Cronologia_Sinistro_id_key" ON "formularios_do_relatorio"("form3_Cronologia_Sinistro_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form4_Do_Carregamento_id_key" ON "formularios_do_relatorio"("form4_Do_Carregamento_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form5_Motorista_id_key" ON "formularios_do_relatorio"("form5_Motorista_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form6_Ajudantes_id_key" ON "formularios_do_relatorio"("form6_Ajudantes_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form7_Veiculo_Transportador_id_key" ON "formularios_do_relatorio"("form7_Veiculo_Transportador_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form8_Orgao_Policial_id_key" ON "formularios_do_relatorio"("form8_Orgao_Policial_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo__key" ON "formularios_do_relatorio"("form9_Gerenciamento_Risco_Veiculo_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form10_Sistemas_Protecao_Carregame_key" ON "formularios_do_relatorio"("form10_Sistemas_Protecao_Carregamento_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form11_Declaracao_Motorista_Ajudan_key" ON "formularios_do_relatorio"("form11_Declaracao_Motorista_Ajudante_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposit_key" ON "formularios_do_relatorio"("form12_Gerenciamento_Risco_Deposito_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form13_Locais_Evento_id_key" ON "formularios_do_relatorio"("form13_Locais_Evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_key" ON "formularios_do_relatorio"("form14_Resumo_Averiguacoes_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form15_Recuperacao_Carga_id_key" ON "formularios_do_relatorio"("form15_Recuperacao_Carga_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form16_Anexos_Fotograficos_id_key" ON "formularios_do_relatorio"("form16_Anexos_Fotograficos_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_form17_Conclusao_id_key" ON "formularios_do_relatorio"("form17_Conclusao_id");

-- CreateIndex
CREATE UNIQUE INDEX "formularios_do_relatorio_relatorio_id_key" ON "formularios_do_relatorio"("relatorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_cliente_segurado_numero_processo_key" ON "form_cliente_segurado"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_caracteristica_sinistro_numero_processo_key" ON "form_caracteristica_sinistro"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_cronologia_sinistro_numero_processo_key" ON "form_cronologia_sinistro"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_do_carregamento_numero_processo_key" ON "form_do_carregamento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_motorista_numero_processo_key" ON "form_motorista"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_ajudantes_numero_processo_key" ON "form_ajudantes"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_veiculo_transportador_numero_processo_key" ON "form_veiculo_transportador"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_orgao_policial_numero_processo_key" ON "form_orgao_policial"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_gerenciamento_risco_veiculo_numero_processo_key" ON "form_gerenciamento_risco_veiculo"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_sistemas_protecao_carregamento_numero_processo_key" ON "form_sistemas_protecao_carregamento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_declaracao_motorista_ajudante_numero_processo_key" ON "form_declaracao_motorista_ajudante"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_gerenciamento_risco_deposito_numero_processo_key" ON "form_gerenciamento_risco_deposito"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_locais_evento_numero_processo_key" ON "form_locais_evento"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_resumo_averiguacoes_numero_processo_key" ON "form_resumo_averiguacoes"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_recuperacao_carga_numero_processo_key" ON "form_recuperacao_carga"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_anexos_fotograficos_numero_processo_key" ON "form_anexos_fotograficos"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "form_conclusao_numero_processo_key" ON "form_conclusao"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_numero_processo_key" ON "arquivos"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "_Usuarios_Permitidos_Para_Relatorio_AB_unique" ON "_Usuarios_Permitidos_Para_Relatorio"("A", "B");

-- CreateIndex
CREATE INDEX "_Usuarios_Permitidos_Para_Relatorio_B_index" ON "_Usuarios_Permitidos_Para_Relatorio"("B");

-- AddForeignKey
ALTER TABLE "tokensAtualizacao" ADD CONSTRAINT "tokensAtualizacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_usuario_responsavel_id_fkey" FOREIGN KEY ("usuario_responsavel_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form1_Cliente_Segurado_id_fkey" FOREIGN KEY ("form1_Cliente_Segurado_id") REFERENCES "form_cliente_segurado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_fkey" FOREIGN KEY ("form2_Caracteristica_Sinistro_id") REFERENCES "form_caracteristica_sinistro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form3_Cronologia_Sinistro_id_fkey" FOREIGN KEY ("form3_Cronologia_Sinistro_id") REFERENCES "form_cronologia_sinistro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form4_Do_Carregamento_id_fkey" FOREIGN KEY ("form4_Do_Carregamento_id") REFERENCES "form_do_carregamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form5_Motorista_id_fkey" FOREIGN KEY ("form5_Motorista_id") REFERENCES "form_motorista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form6_Ajudantes_id_fkey" FOREIGN KEY ("form6_Ajudantes_id") REFERENCES "form_ajudantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form7_Veiculo_Transportador_id_fkey" FOREIGN KEY ("form7_Veiculo_Transportador_id") REFERENCES "form_veiculo_transportador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form8_Orgao_Policial_id_fkey" FOREIGN KEY ("form8_Orgao_Policial_id") REFERENCES "form_orgao_policial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo_fkey" FOREIGN KEY ("form9_Gerenciamento_Risco_Veiculo_id") REFERENCES "form_gerenciamento_risco_veiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form10_Sistemas_Protecao_Carregam_fkey" FOREIGN KEY ("form10_Sistemas_Protecao_Carregamento_id") REFERENCES "form_sistemas_protecao_carregamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form11_Declaracao_Motorista_Ajuda_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form_declaracao_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposi_fkey" FOREIGN KEY ("form12_Gerenciamento_Risco_Deposito_id") REFERENCES "form_gerenciamento_risco_deposito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form_locais_evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_fkey" FOREIGN KEY ("form14_Resumo_Averiguacoes_id") REFERENCES "form_resumo_averiguacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form15_Recuperacao_Carga_id_fkey" FOREIGN KEY ("form15_Recuperacao_Carga_id") REFERENCES "form_recuperacao_carga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form_anexos_fotograficos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form17_Conclusao_id_fkey" FOREIGN KEY ("form17_Conclusao_id") REFERENCES "form_conclusao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_relatorio_id_fkey" FOREIGN KEY ("relatorio_id") REFERENCES "relatorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form11_Declaracao_Motorista_Ajudante_id_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form_declaracao_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form_anexos_fotograficos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form_locais_evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Usuarios_Permitidos_Para_Relatorio" ADD CONSTRAINT "_Usuarios_Permitidos_Para_Relatorio_A_fkey" FOREIGN KEY ("A") REFERENCES "relatorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Usuarios_Permitidos_Para_Relatorio" ADD CONSTRAINT "_Usuarios_Permitidos_Para_Relatorio_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
