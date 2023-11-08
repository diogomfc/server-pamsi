/*
  Warnings:

  - Made the column `numero_processo` on table `form9_Gerenciamento_Risco_Veiculo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "form9_Gerenciamento_Risco_Veiculo" ADD COLUMN     "bloqueio_rastreador" BOOLEAN DEFAULT false,
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "disco_tacografo_data_hora" TEXT,
ADD COLUMN     "disco_tacografo_descricao" TEXT,
ADD COLUMN     "historico_rastreamento" BOOLEAN DEFAULT false,
ADD COLUMN     "macros_transmitida" BOOLEAN DEFAULT false,
ADD COLUMN     "paradas_nao_programadas" BOOLEAN DEFAULT false,
ADD COLUMN     "plano_viagem" BOOLEAN DEFAULT false,
ADD COLUMN     "rastramento_analisado" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_bloqueio_combustivel" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_bloqueio_ignicao" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_botao_panico" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_desengate_carreta" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_isca" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_outros" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_outros_descricao" TEXT,
ADD COLUMN     "sensor_porta_bau" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_porta_cabine" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_sonoros_visuais" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_teclado" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_trava_5Roda" BOOLEAN DEFAULT false,
ADD COLUMN     "sensor_trava_portas_bau" BOOLEAN DEFAULT false,
ADD COLUMN     "sirene_ativada" BOOLEAN DEFAULT false,
ADD COLUMN     "tacografo" BOOLEAN DEFAULT false,
ADD COLUMN     "tacografo_analisado" BOOLEAN DEFAULT false,
ADD COLUMN     "ultima_posicao_rastreamento_data_hora" TEXT,
ADD COLUMN     "ultima_posicao_rastreamento_descricao" TEXT,
ADD COLUMN     "vandalismo_rastreador" BOOLEAN DEFAULT false,
ALTER COLUMN "numero_processo" SET NOT NULL;
