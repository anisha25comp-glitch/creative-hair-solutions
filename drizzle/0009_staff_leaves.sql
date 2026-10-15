CREATE TABLE `staffLeaves` (
  `id` int AUTO_INCREMENT NOT NULL,
  `providerId` int,
  `providerName` varchar(160) NOT NULL,
  `leaveDate` timestamp NOT NULL,
  `reason` varchar(240),
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `staffLeaves_id` PRIMARY KEY(`id`)
);
