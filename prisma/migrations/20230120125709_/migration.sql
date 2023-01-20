/*
  Warnings:

  - You are about to drop the column `aicraftType` on the `aircraft` table. All the data in the column will be lost.
  - You are about to drop the column `pilotId` on the `aircraft` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entityId]` on the table `actor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `actor` ADD COLUMN `entityId` INTEGER NULL;

-- AlterTable
ALTER TABLE `aircraft` DROP COLUMN `aicraftType`,
    DROP COLUMN `pilotId`,
    ADD COLUMN `aircraftType` ENUM('BVS', 'PILOT') NOT NULL DEFAULT 'BVS';

-- CreateIndex
CREATE UNIQUE INDEX `actor_entityId_key` ON `actor`(`entityId`);
