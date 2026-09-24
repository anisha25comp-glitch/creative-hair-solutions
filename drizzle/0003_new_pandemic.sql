CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(160) NOT NULL,
	`contactNumber` varchar(32),
	`branch` enum('ulhasnagar','badlapur') NOT NULL DEFAULT 'ulhasnagar',
	`rating` int NOT NULL,
	`comments` text NOT NULL,
	`status` enum('new','reviewed','resolved') NOT NULL DEFAULT 'new',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
