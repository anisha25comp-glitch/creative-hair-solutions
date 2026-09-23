CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(160) NOT NULL,
	`contactNumber` varchar(32) NOT NULL,
	`email` varchar(320),
	`branch` enum('ulhasnagar','badlapur') NOT NULL DEFAULT 'ulhasnagar',
	`source` varchar(80),
	`assignedTo` varchar(120),
	`service` varchar(160),
	`gender` enum('female','male','other'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','staff') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `appointments` ADD `branch` enum('ulhasnagar','badlapur') DEFAULT 'ulhasnagar' NOT NULL;--> statement-breakpoint
ALTER TABLE `bills` ADD `branch` enum('ulhasnagar','badlapur') DEFAULT 'ulhasnagar' NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `branch` enum('ulhasnagar','badlapur') DEFAULT 'ulhasnagar' NOT NULL;