/*
  Warnings:

  - You are about to alter the column `count` on the `BasketProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "BasketProduct" ALTER COLUMN "count" SET DATA TYPE DOUBLE PRECISION;
