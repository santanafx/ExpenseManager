/*
  Warnings:

  - Added the required column `description` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "description" TEXT NOT NULL;
