/*
  Warnings:

  - You are about to drop the column `form10_Sistemas_Protecao_Carregamento_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form11_Declaracao_Motorista_Ajudante_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form12_Gerenciamento_Risco_Deposito_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form13_Locais_Evento_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form14_Resumo_Averiguacoes_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form15_Recuperacao_Carga_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form16_Anexos_Fotograficos_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form17_Conclusao_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form1_Cliente_Segurado_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form2_Caracteristica_Sinistro_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form3_Cronologia_Sinistro_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form4_Do_Carregamento_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form5_Motorista_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form6_Ajudantes_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form7_Veiculo_Transportador_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form8_Orgao_Policial_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `form9_Gerenciamento_Risco_Veiculo_id` on the `formularios_do_relatorio` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "formularios_do_relatorio_form10_Sistemas_Protecao_Carregame_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form11_Declaracao_Motorista_Ajudan_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form12_Gerenciamento_Risco_Deposit_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form13_Locais_Evento_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form14_Resumo_Averiguacoes_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form15_Recuperacao_Carga_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form16_Anexos_Fotograficos_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form17_Conclusao_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form1_Cliente_Segurado_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form2_Caracteristica_Sinistro_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form3_Cronologia_Sinistro_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form4_Do_Carregamento_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form5_Motorista_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form6_Ajudantes_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form7_Veiculo_Transportador_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form8_Orgao_Policial_id_key";

-- DropIndex
DROP INDEX "formularios_do_relatorio_form9_Gerenciamento_Risco_Veiculo__key";

-- AlterTable
ALTER TABLE "formularios_do_relatorio" DROP COLUMN "form10_Sistemas_Protecao_Carregamento_id",
DROP COLUMN "form11_Declaracao_Motorista_Ajudante_id",
DROP COLUMN "form12_Gerenciamento_Risco_Deposito_id",
DROP COLUMN "form13_Locais_Evento_id",
DROP COLUMN "form14_Resumo_Averiguacoes_id",
DROP COLUMN "form15_Recuperacao_Carga_id",
DROP COLUMN "form16_Anexos_Fotograficos_id",
DROP COLUMN "form17_Conclusao_id",
DROP COLUMN "form1_Cliente_Segurado_id",
DROP COLUMN "form2_Caracteristica_Sinistro_id",
DROP COLUMN "form3_Cronologia_Sinistro_id",
DROP COLUMN "form4_Do_Carregamento_id",
DROP COLUMN "form5_Motorista_id",
DROP COLUMN "form6_Ajudantes_id",
DROP COLUMN "form7_Veiculo_Transportador_id",
DROP COLUMN "form8_Orgao_Policial_id",
DROP COLUMN "form9_Gerenciamento_Risco_Veiculo_id";
