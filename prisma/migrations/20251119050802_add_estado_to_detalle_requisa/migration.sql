-- AlterTable
ALTER TABLE `detalle_requisas` ADD COLUMN `estado` ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente';
