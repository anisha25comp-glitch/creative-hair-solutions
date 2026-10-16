ALTER TABLE `clients` ADD COLUMN `normalizedPhone` varchar(32);
UPDATE `clients` SET `normalizedPhone` = CASE WHEN CHAR_LENGTH(REGEXP_REPLACE(`contactNumber`, '[^0-9]', '')) = 10 THEN CONCAT('91', REGEXP_REPLACE(`contactNumber`, '[^0-9]', '')) ELSE REGEXP_REPLACE(`contactNumber`, '[^0-9]', '') END WHERE `normalizedPhone` IS NULL;
CREATE INDEX `clients_normalized_phone_idx` ON `clients` (`normalizedPhone`);
ALTER TABLE `bills` ADD COLUMN `subtotal` int, ADD COLUMN `discountAmount` int, ADD COLUMN `gstEnabled` int NOT NULL DEFAULT 0, ADD COLUMN `gstRate` int, ADD COLUMN `gstAmount` int, ADD COLUMN `deletedAt` timestamp NULL, ADD COLUMN `deletedBy` int, ADD COLUMN `deleteReason` varchar(240);
CREATE TABLE `billAudit` (`id` int AUTO_INCREMENT NOT NULL, `billId` int NOT NULL, `action` varchar(40) NOT NULL, `userId` int, `details` varchar(240), `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `billAudit_id` PRIMARY KEY(`id`));
