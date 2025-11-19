-- AlterTable
ALTER TABLE `detalle_requisas` ADD COLUMN `bodegaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `requisas` MODIFY `estado` ENUM('pendiente', 'en_proceso', 'aprobada', 'rechazada', 'completada') NOT NULL DEFAULT 'pendiente';

-- AddForeignKey
ALTER TABLE `detalle_requisas` ADD CONSTRAINT `detalle_requisas_bodegaId_fkey` FOREIGN KEY (`bodegaId`) REFERENCES `bodegas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
