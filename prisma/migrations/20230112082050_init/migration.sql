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
    `icao` VARCHAR(45) NULL,
    `flags` VARCHAR(255) NULL,
    `isRoundTheClock` BOOLEAN NOT NULL,
    `regulations` VARCHAR(200) NULL,
    `type` VARCHAR(10) NULL,
    `belonging` VARCHAR(45) NULL,
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
    `codeRu` VARCHAR(4) NULL,
    `name` VARCHAR(45) NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `militaryZoneId` INTEGER UNSIGNED NULL,
    `militaryZoneName` VARCHAR(45) NULL,
    `workAboutSchedule` VARCHAR(1000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `fileSize` INTEGER UNSIGNED NOT NULL,
    `lastDateUpdate` DATETIME(0) NOT NULL,
    `checkSum` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bvs_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `comment` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bvs_group_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `wrong_attempts` TINYINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `login`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_group` (
    `userId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    UNIQUE INDEX `user_group_userId_groupId_key`(`userId`, `groupId`),
    PRIMARY KEY (`userId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `zoneBoundary` ADD CONSTRAINT `zoneBoundary_ibfk_1` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zonePoint` ADD CONSTRAINT `zonePoint_ibfk_1` FOREIGN KEY (`boundaryId`) REFERENCES `zoneBoundary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `bvs_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
