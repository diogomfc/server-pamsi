-- AlterTable
ALTER TABLE "form12_Gerenciamento_Risco_Deposito" ADD COLUMN     "deposito_mercadoria_carregada" BOOLEAN DEFAULT false,
ADD COLUMN     "deposito_seguranca_eletronica" BOOLEAN DEFAULT false,
ADD COLUMN     "deposito_seguranca_patrimonial" BOOLEAN DEFAULT false,
ADD COLUMN     "deposito_sinistrado_segurado" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_alarme_sonoro" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_botao_panico" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_cerca_eletrica" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_cftv" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_outros" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_sensores_invasao" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_sensores_presenca" BOOLEAN DEFAULT false,
ADD COLUMN     "dispositivo_seguranca_sirene" BOOLEAN DEFAULT false,
ADD COLUMN     "empresa_seguranca_patrimonial_bairro" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_celular" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_cep" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_cidade" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_cnpj" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_complemento" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_email" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_endereco" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_nome" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_numero" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_representante" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_telefone" TEXT,
ADD COLUMN     "empresa_seguranca_patrimonial_uf" TEXT;
