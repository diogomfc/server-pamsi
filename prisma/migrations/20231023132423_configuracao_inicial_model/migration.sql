-- CreateEnum
CREATE TYPE "FuncaoUsuario" AS ENUM ('Admin', 'Analista', 'Supervisor', 'Revisor');

-- CreateEnum
CREATE TYPE "StatusRelatorio" AS ENUM ('Formalizando', 'Finalizado', 'Aprovado', 'Rejeitado');

-- CreateEnum
CREATE TYPE "TipoEtapa" AS ENUM ('stepClienteSegurado', 'stepDeclaracaoMotoristaAjudante');

-- CreateEnum
CREATE TYPE "StatusEtapa" AS ENUM ('Pendente', 'Formalizando', 'Finalizado');

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
CREATE TABLE "tokens_atualizacao" (
    "id" TEXT NOT NULL,
    "expira_em" INTEGER NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_atualizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios" (
    "id" TEXT NOT NULL,
    "numero_processo" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_emissao" TIMESTAMP(3),
    "status" "StatusRelatorio" NOT NULL DEFAULT 'Formalizando',
    "criador_id" TEXT NOT NULL,

    CONSTRAINT "relatorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etapas_relatorios" (
    "id" TEXT NOT NULL,
    "tipoEtapa" "TipoEtapa" NOT NULL,
    "statusEtapa" "StatusEtapa" NOT NULL,
    "numeroEtapa" TEXT NOT NULL,
    "numeroProcesso" TEXT,
    "clienteSeguradoId" TEXT,
    "declaracaoMotoristaAjudanteId" TEXT,
    "relatorioId" TEXT NOT NULL,

    CONSTRAINT "etapas_relatorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes_segurados" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '1',
    "status" "StatusEtapa" NOT NULL,
    "nomeCliente" TEXT,
    "cnpj" TEXT,
    "numero_processo" TEXT,

    CONSTRAINT "clientes_segurados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declaracoes_motorista_ajudante" (
    "id" TEXT NOT NULL,
    "numero_etapa" TEXT NOT NULL DEFAULT '11',
    "status" "StatusEtapa" NOT NULL,
    "numero_processo" TEXT,

    CONSTRAINT "declaracoes_motorista_ajudante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "tamanho" INTEGER,
    "chave" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "numero_processo" TEXT,
    "declaracaoMotoristaAjudanteId" TEXT,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuariosPermitidosParaRelatorio" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_atualizacao_usuario_id_key" ON "tokens_atualizacao"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "relatorios_numero_processo_key" ON "relatorios"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuariosPermitidosParaRelatorio_AB_unique" ON "_UsuariosPermitidosParaRelatorio"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuariosPermitidosParaRelatorio_B_index" ON "_UsuariosPermitidosParaRelatorio"("B");

-- AddForeignKey
ALTER TABLE "tokens_atualizacao" ADD CONSTRAINT "tokens_atualizacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etapas_relatorios" ADD CONSTRAINT "etapas_relatorios_clienteSeguradoId_fkey" FOREIGN KEY ("clienteSeguradoId") REFERENCES "clientes_segurados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etapas_relatorios" ADD CONSTRAINT "etapas_relatorios_declaracaoMotoristaAjudanteId_fkey" FOREIGN KEY ("declaracaoMotoristaAjudanteId") REFERENCES "declaracoes_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etapas_relatorios" ADD CONSTRAINT "etapas_relatorios_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_declaracaoMotoristaAjudanteId_fkey" FOREIGN KEY ("declaracaoMotoristaAjudanteId") REFERENCES "declaracoes_motorista_ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuariosPermitidosParaRelatorio" ADD CONSTRAINT "_UsuariosPermitidosParaRelatorio_A_fkey" FOREIGN KEY ("A") REFERENCES "relatorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuariosPermitidosParaRelatorio" ADD CONSTRAINT "_UsuariosPermitidosParaRelatorio_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
