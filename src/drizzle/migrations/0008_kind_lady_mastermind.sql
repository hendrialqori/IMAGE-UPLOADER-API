CREATE TABLE `settings` (
	`id` varchar(16) NOT NULL,
	`name` varchar(255) NOT NULL,
	`value` varchar(225) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
