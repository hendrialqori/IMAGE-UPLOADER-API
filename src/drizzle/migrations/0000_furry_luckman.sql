CREATE TABLE `images` (
	`id` varchar(16) NOT NULL,
	`title` varchar(255) NOT NULL,
	`md5` varchar(255) NOT NULL,
	`user_id` varchar(16) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(16) NOT NULL,
	`username` varchar(225) NOT NULL,
	`password` varchar(225) NOT NULL,
	`role` enum('SUPER_ADMIN','MEMBER') DEFAULT 'MEMBER',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;