-- AlterTable
ALTER TABLE "form2_Caracteristica_Sinistro" ALTER COLUMN "carga_embarcada" DROP NOT NULL,
ALTER COLUMN "natureza_sinistro" DROP DEFAULT,
ALTER COLUMN "nome_seguradora" DROP NOT NULL,
ALTER COLUMN "valor_carga" DROP NOT NULL;
