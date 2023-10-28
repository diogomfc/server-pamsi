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

-- AddForeignKey
ALTER TABLE "form1_Cliente_Segurado" ADD CONSTRAINT "form1_Cliente_Segurado_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form2_Caracteristica_Sinistro" ADD CONSTRAINT "form2_Caracteristica_Sinistro_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form3_Cronologia_Sinistro" ADD CONSTRAINT "form3_Cronologia_Sinistro_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form4_Do_Carregamento" ADD CONSTRAINT "form4_Do_Carregamento_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form5_Motorista" ADD CONSTRAINT "form5_Motorista_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form6_Ajudantes" ADD CONSTRAINT "form6_Ajudantes_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form7_Veiculo_Transportador" ADD CONSTRAINT "form7_Veiculo_Transportador_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form8_Orgao_Policial" ADD CONSTRAINT "form8_Orgao_Policial_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" ADD CONSTRAINT "form9_Gerenciamento_Risco_Veiculo_formulariosDoRelatorio_i_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form10_Sistemas_Protecao_Carregamento" ADD CONSTRAINT "form10_Sistemas_Protecao_Carregamento_formulariosDoRelator_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form11_Declaracao_Motorista_Ajudante" ADD CONSTRAINT "form11_Declaracao_Motorista_Ajudante_formulariosDoRelatori_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" ADD CONSTRAINT "form12_Gerenciamento_Risco_Deposito_formulariosDoRelatorio_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form13_Locais_Evento" ADD CONSTRAINT "form13_Locais_Evento_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form14_Resumo_Averiguacoes" ADD CONSTRAINT "form14_Resumo_Averiguacoes_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form15_Recuperacao_Carga" ADD CONSTRAINT "form15_Recuperacao_Carga_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form16_Anexos_Fotograficos" ADD CONSTRAINT "form16_Anexos_Fotograficos_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form17_Conclusao" ADD CONSTRAINT "form17_Conclusao_formulariosDoRelatorio_id_fkey" FOREIGN KEY ("formulariosDoRelatorio_id") REFERENCES "formularios_do_relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
