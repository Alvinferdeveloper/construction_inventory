/*
  Warnings:

  - A unique constraint covering the columns `[detalleRequisaId]` on the table `movimientos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `movimientos` ADD COLUMN `detalleRequisaId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `movimientos_detalleRequisaId_key` ON `movimientos`(`detalleRequisaId`);

-- AddForeignKey
ALTER TABLE `movimientos` ADD CONSTRAINT `movimientos_detalleRequisaId_fkey` FOREIGN KEY (`detalleRequisaId`) REFERENCES `detalle_requisas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
