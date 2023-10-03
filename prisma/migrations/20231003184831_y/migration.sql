/*
  Warnings:

  - The primary key for the `BasketProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "BasketProduct_basketId_productId_key";

-- AlterTable
ALTER TABLE "BasketProduct" DROP CONSTRAINT "BasketProduct_pkey",
ADD CONSTRAINT "BasketProduct_pkey" PRIMARY KEY ("basketId", "productId");
