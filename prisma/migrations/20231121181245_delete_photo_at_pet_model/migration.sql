/*
  Warnings:

  - You are about to drop the `anexo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anexo" DROP CONSTRAINT "anexo_question_id_fkey";

-- DropTable
DROP TABLE "anexo";
