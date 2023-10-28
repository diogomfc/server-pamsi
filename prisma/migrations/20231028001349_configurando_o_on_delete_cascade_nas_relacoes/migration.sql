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

-- DropForeignKey
ALTER TABLE "formularios_do_relatorio" DROP CONSTRAINT "formularios_do_relatorio_relatorio_id_fkey";

-- DropForeignKey
ALTER TABLE "relatorios" DROP CONSTRAINT "relatorios_usuario_responsavel_id_fkey";

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_usuario_responsavel_id_fkey" FOREIGN KEY ("usuario_responsavel_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_relatorio_id_fkey" FOREIGN KEY ("relatorio_id") REFERENCES "relatorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form1_Cliente_Segurado_id_fkey" FOREIGN KEY ("form1_Cliente_Segurado_id") REFERENCES "form1_Cliente_Segurado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_fkey" FOREIGN KEY ("form2_Caracteristica_Sinistro_id") REFERENCES "form2_Caracteristica_Sinistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form3_Cronologia_Sinistro_id_fkey" FOREIGN KEY ("form3_Cronologia_Sinistro_id") REFERENCES "form3_Cronologia_Sinistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form4_Do_Carregamento_id_fkey" FOREIGN KEY ("form4_Do_Carregamento_id") REFERENCES "form4_Do_Carregamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form5_Motorista_id_fkey" FOREIGN KEY ("form5_Motorista_id") REFERENCES "form5_Motorista"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form6_Ajudantes_id_fkey" FOREIGN KEY ("form6_Ajudantes_id") REFERENCES "form6_Ajudantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form7_Veiculo_Transportador_id_fkey" FOREIGN KEY ("form7_Veiculo_Transportador_id") REFERENCES "form7_Veiculo_Transportador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form8_Orgao_Policial_id_fkey" FOREIGN KEY ("form8_Orgao_Policial_id") REFERENCES "form8_Orgao_Policial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo_fkey" FOREIGN KEY ("form9_Gerenciamento_Risco_Veiculo_id") REFERENCES "form9_Gerenciamento_Risco_Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form10_Sistemas_Protecao_Carregam_fkey" FOREIGN KEY ("form10_Sistemas_Protecao_Carregamento_id") REFERENCES "form10_Sistemas_Protecao_Carregamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form11_Declaracao_Motorista_Ajuda_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposi_fkey" FOREIGN KEY ("form12_Gerenciamento_Risco_Deposito_id") REFERENCES "form12_Gerenciamento_Risco_Deposito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_fkey" FOREIGN KEY ("form14_Resumo_Averiguacoes_id") REFERENCES "form14_Resumo_Averiguacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form15_Recuperacao_Carga_id_fkey" FOREIGN KEY ("form15_Recuperacao_Carga_id") REFERENCES "form15_Recuperacao_Carga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form16_Anexos_Fotograficos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios_do_relatorio" ADD CONSTRAINT "formularios_do_relatorio_form17_Conclusao_id_fkey" FOREIGN KEY ("form17_Conclusao_id") REFERENCES "form17_Conclusao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form11_Declaracao_Motorista_Ajudante_id_fkey" FOREIGN KEY ("form11_Declaracao_Motorista_Ajudante_id") REFERENCES "form11_Declaracao_Motorista_Ajudante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form13_Locais_Evento_id_fkey" FOREIGN KEY ("form13_Locais_Evento_id") REFERENCES "form13_Locais_Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_form16_Anexos_Fotograficos_id_fkey" FOREIGN KEY ("form16_Anexos_Fotograficos_id") REFERENCES "form16_Anexos_Fotograficos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
