CREATE TABLE `services` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(160) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `durationMinutes` int NOT NULL,
  `taxPercent` int NOT NULL DEFAULT 18,
  `active` int NOT NULL DEFAULT 1,
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `services_id` PRIMARY KEY(`id`),
  CONSTRAINT `services_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
  `id` int AUTO_INCREMENT NOT NULL,
  `fullName` varchar(160) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `email` varchar(320),
  `role` varchar(80) NOT NULL,
  `specialization` varchar(160),
  `joiningDate` timestamp,
  `commissionType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `commissionValue` int NOT NULL DEFAULT 0,
  `workingHours` varchar(120),
  `active` int NOT NULL DEFAULT 1,
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(160) NOT NULL,
  `sku` varchar(80) NOT NULL,
  `category` varchar(100) NOT NULL,
  `supplier` varchar(160),
  `purchaseCost` int NOT NULL DEFAULT 0,
  `sellingPrice` int NOT NULL DEFAULT 0,
  `quantity` int NOT NULL DEFAULT 0,
  `minimumStock` int NOT NULL DEFAULT 0,
  `expiryDate` timestamp,
  `active` int NOT NULL DEFAULT 1,
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `products_id` PRIMARY KEY(`id`),
  CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `stockMovements` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `movementType` enum('purchase','adjustment','sale','refund') NOT NULL,
  `quantity` int NOT NULL,
  `quantityAfter` int NOT NULL,
  `reason` varchar(240),
  `referenceId` varchar(80),
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `stockMovements_id` PRIMARY KEY(`id`)
);
