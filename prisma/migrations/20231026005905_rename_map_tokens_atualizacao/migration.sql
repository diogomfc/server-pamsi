/*
  Warnings:

  - You are about to drop the `tokensAtualizacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokensAtualizacao" DROP CONSTRAINT "tokensAtualizacao_usuario_id_fkey";

-- DropTable
DROP TABLE "tokensAtualizacao";

-- CreateTable
CREATE TABLE "tokens_atualizacao" (
    "id" TEXT NOT NULL,
    "expira_em" INTEGER NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_atualizacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_atualizacao_usuario_id_key" ON "tokens_atualizacao"("usuario_id");

-- AddForeignKey
ALTER TABLE "tokens_atualizacao" ADD CONSTRAINT "tokens_atualizacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
