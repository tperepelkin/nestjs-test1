-- CreateTable
CREATE TABLE `AircraftRegistry` (
    `aircraftNumber` VARCHAR(191) NOT NULL,
    `pilotId` INTEGER NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `aicraftType` TINYINT UNSIGNED NOT NULL,

    UNIQUE INDEX `AircraftRegistry_aircraftNumber_key`(`aircraftNumber`),
    PRIMARY KEY (`aircraftNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restriction` (
    `name` VARCHAR(191) NOT NULL,
    `minHeight` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `maxHeight` INTEGER UNSIGNED NULL,
    `boundaries` VARCHAR(191) NOT NULL,
    `schedule` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `objType` VARCHAR(191) NULL,
    `objName` VARCHAR(191) NULL,
    `airdromes` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `bottomFlag` VARCHAR(191) NULL,
    `flag` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endTime` DATETIME(3) NULL,

    UNIQUE INDEX `Restriction_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aircraftRef` VARCHAR(191) NOT NULL,
    `restrictionRef` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endTime` DATETIME(3) NULL,

    UNIQUE INDEX `Permission_restrictionRef_key`(`restrictionRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AircraftRegistryToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AircraftRegistryToUser_AB_unique`(`A`, `B`),
    INDEX `_AircraftRegistryToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AircraftRegistry` ADD CONSTRAINT `AircraftRegistry_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_aircraftRef_fkey` FOREIGN KEY (`aircraftRef`) REFERENCES `AircraftRegistry`(`aircraftNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_restrictionRef_fkey` FOREIGN KEY (`restrictionRef`) REFERENCES `Restriction`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AircraftRegistryToUser` ADD CONSTRAINT `_AircraftRegistryToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `AircraftRegistry`(`aircraftNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AircraftRegistryToUser` ADD CONSTRAINT `_AircraftRegistryToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
