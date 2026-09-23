CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactNumber` varchar(32) NOT NULL,
	`clientName` varchar(160) NOT NULL,
	`email` varchar(320),
	`address` text,
	`enquiryFor` varchar(160) NOT NULL,
	`enquiryType` varchar(80) NOT NULL,
	`response` text,
	`followUpDate` timestamp NOT NULL,
	`source` varchar(80) NOT NULL,
	`leadRepresentative` varchar(120),
	`leadStatus` enum('pending','contacted','converted','lost') NOT NULL DEFAULT 'pending',
	`sendChannel` enum('sms','whatsapp') NOT NULL DEFAULT 'whatsapp',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
