/*
  Warnings:

  - The values [form_1_cliente_segurado,form_2_caracteristica_sinistro,form_3_cronologia_sinistro,form_4_do_carregamento,form_5_motorista,form_6_ajudantes,form_7_veiculo_transportador,form_8_orgao_policial,form_9_gerenciamento_risco_veiculo,form_10_sistemas_protecao_carregamento,form_11_declaracao_motorista_ajudante,form_12_gerenciamento_risco_deposito,form_13_locais_evento,form_14_resumo_averiguacoes,form_15_recuperacao_carga,form_16_anexos_fotograficos,form_17_conclusao] on the enum `Tipo_Formulario` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_Formulario_new" AS ENUM ('form1_Cliente_Segurado', 'form2_Caracteristica_Sinistro', 'form3_Cronologia_Sinistro', 'form4_Do_Carregamento', 'form5_Motorista', 'form6_Ajudantes', 'form7_Veiculo_Transportador', 'form8_Orgao_Policial', 'form9_Gerenciamento_Risco_Veiculo', 'form10_Sistemas_Protecao_Carregamento', 'form11_Declaracao_Motorista_Ajudante', 'form12_Gerenciamento_Risco_Deposito', 'form13_Locais_Evento', 'form14_Resumo_Averiguacoes', 'form15_Recuperacao_Carga', 'form16_Anexos_Fotograficos', 'form17_Conclusao');
ALTER TABLE "relatorios" ALTER COLUMN "formularios_selecionados" TYPE "Tipo_Formulario_new"[] USING ("formularios_selecionados"::text::"Tipo_Formulario_new"[]);
ALTER TYPE "Tipo_Formulario" RENAME TO "Tipo_Formulario_old";
ALTER TYPE "Tipo_Formulario_new" RENAME TO "Tipo_Formulario";
DROP TYPE "Tipo_Formulario_old";
COMMIT;
