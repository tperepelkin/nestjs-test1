-- CreateTable
CREATE TABLE `Migrate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group` ENUM('USER', 'ENGENEER', 'DISPATCHER', 'OWNER', 'PILOT') NOT NULL DEFAULT 'USER',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bvs_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(50) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `wrong_attempts` TINYINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `login`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bvs_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `comment` VARCHAR(250) NULL,

    UNIQUE INDEX `bvs_role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads_b` (
    `dsi` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `target_status` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `time_of_rep_trans` DOUBLE NOT NULL DEFAULT 0,
    `B` DOUBLE NOT NULL DEFAULT 0,
    `L` DOUBLE NOT NULL DEFAULT 0,
    `H_fl` DOUBLE NOT NULL DEFAULT 0,
    `H_gh` DOUBLE NOT NULL DEFAULT 0,
    `angel_grd` DOUBLE NOT NULL DEFAULT 0,
    `targ_num` INTEGER NOT NULL DEFAULT 0,
    `target_adress` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `target_ident` VARCHAR(25) NULL DEFAULT '',
    `M3A_code` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `emit_cat` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `aircrft_op_status` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `speed_air` DOUBLE NOT NULL DEFAULT 0,
    `speed_true` DOUBLE NOT NULL DEFAULT 0,
    `speed_grd` DOUBLE NOT NULL DEFAULT 0,
    `trd` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `quality` SMALLINT NOT NULL DEFAULT 0,
    `time_update` DOUBLE NOT NULL DEFAULT 0,
    `flags` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    INDEX `time_update`(`time_update`),
    PRIMARY KEY (`dsi`, `targ_num`, `target_adress`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mlat` (
    `dsi` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `track_status` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `time_of_day` DOUBLE NOT NULL DEFAULT 0,
    `B` DOUBLE NOT NULL DEFAULT 0,
    `L` DOUBLE NOT NULL DEFAULT 0,
    `H_fl` DOUBLE NOT NULL DEFAULT 0,
    `H_gh` DOUBLE NOT NULL DEFAULT 0,
    `H_mode_C` DOUBLE NOT NULL DEFAULT 0,
    `H_ms` DOUBLE NOT NULL DEFAULT 0,
    `targ_num` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `M3A_code` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `target_adress` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `target_ident` VARCHAR(25) NOT NULL DEFAULT '',
    `trd` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `VX` DOUBLE NOT NULL DEFAULT 0,
    `VY` DOUBLE NOT NULL DEFAULT 0,
    `ACAS` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `BDS` BLOB NULL,
    `VFI` TINYINT NOT NULL DEFAULT 0,
    `DOPx` DOUBLE NOT NULL DEFAULT 0,
    `DOPy` DOUBLE NOT NULL DEFAULT 0,
    `contrib_dev` BLOB NULL,
    `time_update` DOUBLE NOT NULL DEFAULT 0,
    `flags` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    INDEX `time_update`(`time_update`),
    PRIMARY KEY (`dsi`, `targ_num`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `psr` (
    `dsi` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `track_status` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `time_of_day` DOUBLE NOT NULL DEFAULT 0,
    `B` DOUBLE NOT NULL DEFAULT 0,
    `L` DOUBLE NOT NULL DEFAULT 0,
    `H_ms` DOUBLE NOT NULL DEFAULT 0,
    `targ_num` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `trd` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `VX` DOUBLE NOT NULL DEFAULT 0,
    `VY` DOUBLE NOT NULL DEFAULT 0,
    `time_update` DOUBLE NOT NULL DEFAULT 0,
    `flags` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    INDEX `time_update`(`time_update`),
    PRIMARY KEY (`dsi`, `targ_num`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zone` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `icao` VARCHAR(10) NULL,
    `flags` VARCHAR(10) NULL,
    `isRoundTheClock` BOOLEAN NOT NULL,
    `regulations` VARCHAR(200) NULL,
    `type` VARCHAR(10) NULL,
    `belonging` VARCHAR(50) NULL,
    `milRcId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zoneBoundary` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `heightMin` INTEGER UNSIGNED NOT NULL,
    `heightMax` INTEGER UNSIGNED NOT NULL,
    `zoneId` INTEGER UNSIGNED NOT NULL,

    INDEX `zoneId`(`zoneId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zonePoint` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `boundaryId` INTEGER UNSIGNED NOT NULL,

    INDEX `boundaryId`(`boundaryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airfield` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(4) NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `militaryZoneId` INTEGER UNSIGNED NULL,
    `militaryZoneName` VARCHAR(50) NULL,
    `workAboutSchedule` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `fileSize` INTEGER UNSIGNED NOT NULL,
    `lastDateUpdate` DATETIME(0) NOT NULL,
    `checkSum` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(250) NOT NULL,
    `actorId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('USER', 'ORGANIZATION') NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `actor_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `individual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(200) NOT NULL,
    `patronimyc` VARCHAR(100) NOT NULL,
    `passportSeries` CHAR(4) NOT NULL,
    `passportNumber` CHAR(6) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `passportSource` VARCHAR(500) NOT NULL,
    `actorId` INTEGER NULL,

    UNIQUE INDEX `individual_actorId_key`(`actorId`),
    UNIQUE INDEX `individual_passportSeries_passportNumber_key`(`passportSeries`, `passportNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `legal_entity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `inn` VARCHAR(12) NOT NULL,
    `ogrn` CHAR(13) NOT NULL,
    `registrationDate` DATETIME(3) NOT NULL,
    `address` VARCHAR(400) NOT NULL,
    `actorId` INTEGER NULL,

    UNIQUE INDEX `legal_entity_actorId_key`(`actorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aircraft` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelName` VARCHAR(191) NOT NULL,
    `aircraftNumber` VARCHAR(191) NOT NULL,
    `pilotId` INTEGER NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `aicraftType` ENUM('BVS', 'PILOT') NOT NULL DEFAULT 'BVS',

    UNIQUE INDEX `aircraft_aircraftNumber_key`(`aircraftNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionNumber` INTEGER NULL,
    `recipientId` INTEGER NOT NULL,
    `target` VARCHAR(250) NOT NULL,
    `zoneDescription` VARCHAR(500) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `isObsoleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Permission_permissionNumber_key`(`permissionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_user_role` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_role_AB_unique`(`A`, `B`),
    INDEX `_user_role_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_permission_airfield` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_permission_airfield_AB_unique`(`A`, `B`),
    INDEX `_permission_airfield_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_permission_pilot` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_permission_pilot_AB_unique`(`A`, `B`),
    INDEX `_permission_pilot_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_pilot_aircrafts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_pilot_aircrafts_AB_unique`(`A`, `B`),
    INDEX `_pilot_aircrafts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_permissions_aircrafts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_permissions_aircrafts_AB_unique`(`A`, `B`),
    INDEX `_permissions_aircrafts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `zoneBoundary` ADD CONSTRAINT `zoneBoundary_ibfk_1` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zonePoint` ADD CONSTRAINT `zonePoint_ibfk_1` FOREIGN KEY (`boundaryId`) REFERENCES `zoneBoundary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `actor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actor` ADD CONSTRAINT `actor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `bvs_user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `individual` ADD CONSTRAINT `individual_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `actor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `legal_entity` ADD CONSTRAINT `legal_entity_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `actor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aircraft` ADD CONSTRAINT `aircraft_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `actor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `actor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_role` ADD CONSTRAINT `_user_role_A_fkey` FOREIGN KEY (`A`) REFERENCES `bvs_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_role` ADD CONSTRAINT `_user_role_B_fkey` FOREIGN KEY (`B`) REFERENCES `bvs_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permission_airfield` ADD CONSTRAINT `_permission_airfield_A_fkey` FOREIGN KEY (`A`) REFERENCES `airfield`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permission_airfield` ADD CONSTRAINT `_permission_airfield_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permission_pilot` ADD CONSTRAINT `_permission_pilot_A_fkey` FOREIGN KEY (`A`) REFERENCES `individual`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permission_pilot` ADD CONSTRAINT `_permission_pilot_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_pilot_aircrafts` ADD CONSTRAINT `_pilot_aircrafts_A_fkey` FOREIGN KEY (`A`) REFERENCES `aircraft`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_pilot_aircrafts` ADD CONSTRAINT `_pilot_aircrafts_B_fkey` FOREIGN KEY (`B`) REFERENCES `individual`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permissions_aircrafts` ADD CONSTRAINT `_permissions_aircrafts_A_fkey` FOREIGN KEY (`A`) REFERENCES `aircraft`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_permissions_aircrafts` ADD CONSTRAINT `_permissions_aircrafts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
