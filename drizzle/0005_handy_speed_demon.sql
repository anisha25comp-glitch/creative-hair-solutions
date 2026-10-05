ALTER TABLE `bills` ADD `gender` enum('female','male','other');--> statement-breakpoint
ALTER TABLE `bills` ADD `providerName` varchar(120);--> statement-breakpoint
ALTER TABLE `bills` ADD `providerWorkAmount` int;