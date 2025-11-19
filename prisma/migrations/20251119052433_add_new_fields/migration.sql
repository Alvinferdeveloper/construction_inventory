-- AlterTable
ALTER TABLE `inventario` ADD COLUMN `maxStock` INTEGER NULL,
    ADD COLUMN `minStock` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `movimientos` ADD COLUMN `reason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `requisas` ADD COLUMN `rejectionComments` VARCHAR(191) NULL;
