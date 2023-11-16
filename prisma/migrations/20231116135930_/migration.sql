-- AlterTable
ALTER TABLE "form13_Locais_Evento" ADD COLUMN     "local_abordagem_bairro" TEXT,
ADD COLUMN     "local_abordagem_cep" TEXT,
ADD COLUMN     "local_abordagem_cftv" BOOLEAN DEFAULT false,
ADD COLUMN     "local_abordagem_cidade" TEXT,
ADD COLUMN     "local_abordagem_complemento" TEXT,
ADD COLUMN     "local_abordagem_data_hora" TEXT,
ADD COLUMN     "local_abordagem_endereco" TEXT,
ADD COLUMN     "local_abordagem_latitude" TEXT,
ADD COLUMN     "local_abordagem_longitude" TEXT,
ADD COLUMN     "local_abordagem_numero" TEXT,
ADD COLUMN     "local_abordagem_ponto_referencia" TEXT,
ADD COLUMN     "local_abordagem_rodovia" TEXT,
ADD COLUMN     "local_abordagem_testemunhas" BOOLEAN DEFAULT false,
ADD COLUMN     "local_abordagem_uf" TEXT,
ADD COLUMN     "local_cativeiro_bairro" TEXT,
ADD COLUMN     "local_cativeiro_cep" TEXT,
ADD COLUMN     "local_cativeiro_cftv" BOOLEAN DEFAULT false,
ADD COLUMN     "local_cativeiro_cidade" TEXT,
ADD COLUMN     "local_cativeiro_complemento" TEXT,
ADD COLUMN     "local_cativeiro_data_hora" TEXT,
ADD COLUMN     "local_cativeiro_endereco" TEXT,
ADD COLUMN     "local_cativeiro_latitude" TEXT,
ADD COLUMN     "local_cativeiro_longitude" TEXT,
ADD COLUMN     "local_cativeiro_numero" TEXT,
ADD COLUMN     "local_cativeiro_ponto_referencia" TEXT,
ADD COLUMN     "local_cativeiro_rodovia" TEXT,
ADD COLUMN     "local_cativeiro_testemunhas" BOOLEAN DEFAULT false,
ADD COLUMN     "local_cativeiro_uf" TEXT,
ADD COLUMN     "local_encontro_bairro" TEXT,
ADD COLUMN     "local_encontro_cep" TEXT,
ADD COLUMN     "local_encontro_cftv" BOOLEAN DEFAULT false,
ADD COLUMN     "local_encontro_cidade" TEXT,
ADD COLUMN     "local_encontro_complemento" TEXT,
ADD COLUMN     "local_encontro_data_hora" TEXT,
ADD COLUMN     "local_encontro_endereco" TEXT,
ADD COLUMN     "local_encontro_latitude" TEXT,
ADD COLUMN     "local_encontro_longitude" TEXT,
ADD COLUMN     "local_encontro_numero" TEXT,
ADD COLUMN     "local_encontro_ponto_referencia" TEXT,
ADD COLUMN     "local_encontro_rodovia" TEXT,
ADD COLUMN     "local_encontro_testemunhas" BOOLEAN DEFAULT false,
ADD COLUMN     "local_encontro_uf" TEXT,
ADD COLUMN     "local_recuperacao_bairro" TEXT,
ADD COLUMN     "local_recuperacao_cep" TEXT,
ADD COLUMN     "local_recuperacao_cftv" BOOLEAN DEFAULT false,
ADD COLUMN     "local_recuperacao_cidade" TEXT,
ADD COLUMN     "local_recuperacao_complemento" TEXT,
ADD COLUMN     "local_recuperacao_data_hora" TEXT,
ADD COLUMN     "local_recuperacao_endereco" TEXT,
ADD COLUMN     "local_recuperacao_latitude" TEXT,
ADD COLUMN     "local_recuperacao_longitude" TEXT,
ADD COLUMN     "local_recuperacao_numero" TEXT,
ADD COLUMN     "local_recuperacao_ponto_referencia" TEXT,
ADD COLUMN     "local_recuperacao_rodovia" TEXT,
ADD COLUMN     "local_recuperacao_testemunhas" BOOLEAN DEFAULT false,
ADD COLUMN     "local_recuperacao_uf" TEXT;

-- CreateTable
CREATE TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_de_Encontro_do_Veiculo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_fotos_local_de_Recuperacao_da_Carga" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_da_cativeiro_Abandono_do_Motorista_AB_unique" ON "_fotos_local_da_cativeiro_Abandono_do_Motorista"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_da_cativeiro_Abandono_do_Motorista_B_index" ON "_fotos_local_da_cativeiro_Abandono_do_Motorista"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_de_Encontro_do_Veiculo_AB_unique" ON "_fotos_local_de_Encontro_do_Veiculo"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_de_Encontro_do_Veiculo_B_index" ON "_fotos_local_de_Encontro_do_Veiculo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fotos_local_de_Recuperacao_da_Carga_AB_unique" ON "_fotos_local_de_Recuperacao_da_Carga"("A", "B");

-- CreateIndex
CREATE INDEX "_fotos_local_de_Recuperacao_da_Carga_B_index" ON "_fotos_local_de_Recuperacao_da_Carga"("B");

-- AddForeignKey
ALTER TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista" ADD CONSTRAINT "_fotos_local_da_cativeiro_Abandono_do_Motorista_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_da_cativeiro_Abandono_do_Motorista" ADD CONSTRAINT "_fotos_local_da_cativeiro_Abandono_do_Motorista_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_Encontro_do_Veiculo" ADD CONSTRAINT "_fotos_local_de_Encontro_do_Veiculo_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_Encontro_do_Veiculo" ADD CONSTRAINT "_fotos_local_de_Encontro_do_Veiculo_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_Recuperacao_da_Carga" ADD CONSTRAINT "_fotos_local_de_Recuperacao_da_Carga_A_fkey" FOREIGN KEY ("A") REFERENCES "arquivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fotos_local_de_Recuperacao_da_Carga" ADD CONSTRAINT "_fotos_local_de_Recuperacao_da_Carga_B_fkey" FOREIGN KEY ("B") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
