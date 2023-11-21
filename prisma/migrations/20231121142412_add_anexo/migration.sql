/*
  Warnings:

  - You are about to drop the column `photo` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "anexo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "question_id" TEXT,

    CONSTRAINT "anexo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
