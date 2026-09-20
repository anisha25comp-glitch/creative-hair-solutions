CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(160) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`service` varchar(160) NOT NULL,
	`appointmentAt` timestamp NOT NULL,
	`notes` text,
	`status` enum('booked','confirmed','completed','cancelled') NOT NULL DEFAULT 'booked',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int,
	`customerName` varchar(160) NOT NULL,
	`itemSummary` text NOT NULL,
	`amount` int NOT NULL,
	`paymentMethod` enum('cash','upi','card','pending') NOT NULL DEFAULT 'pending',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
