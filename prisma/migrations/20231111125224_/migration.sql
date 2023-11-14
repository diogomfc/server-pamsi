-- AlterTable
ALTER TABLE "arquivos" ADD COLUMN     "form11DeclaracaoMotoristaAjudante_id" TEXT;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form11DeclaracaoMotoristaAjudante_id_fkey" FOREIGN KEY ("form11DeclaracaoMotoristaAjudante_id") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
