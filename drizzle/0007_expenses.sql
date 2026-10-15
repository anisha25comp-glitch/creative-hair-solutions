CREATE TABLE `expenses` (
  `id` int AUTO_INCREMENT NOT NULL,
  `category` enum('product','salary','rent','utilities','marketing','other') NOT NULL,
  `description` varchar(240) NOT NULL,
  `amount` int NOT NULL,
  `expenseDate` timestamp NOT NULL,
  `paymentMethod` enum('cash','upi','card','bank') NOT NULL DEFAULT 'cash',
  `providerId` int,
  `createdBy` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
