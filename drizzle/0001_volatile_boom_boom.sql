CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` varchar(128) NOT NULL,
	`exerciseId` varchar(32) NOT NULL,
	`startedAt` timestamp NOT NULL,
	`endedAt` timestamp NOT NULL,
	`reps` int NOT NULL,
	`durationSeconds` int NOT NULL,
	`averageFormScore` int NOT NULL,
	`bestFormScore` int NOT NULL,
	`feedbackHighlights` text NOT NULL,
	`source` enum('camera','demo') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`),
	CONSTRAINT `workouts_user_client_unique` UNIQUE(`userId`,`clientId`)
);
