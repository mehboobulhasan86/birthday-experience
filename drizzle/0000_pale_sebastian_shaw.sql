CREATE TABLE `experiencePhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`experienceId` int NOT NULL,
	`ownerId` int NOT NULL,
	`storageKey` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experiencePhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`slug` varchar(80) NOT NULL,
	`recipientName` varchar(80) NOT NULL,
	`blueprintJson` text NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`generationCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`),
	CONSTRAINT `experiences_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `generationUsage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`usageDate` varchar(10) NOT NULL,
	`generationCount` int NOT NULL DEFAULT 0,
	`regenerationCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generationUsage_id` PRIMARY KEY(`id`)
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
