import { mysqlTable, varchar, timestamp, mysqlEnum, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

const USERS = "users" as const;
const IMAGES = "images" as const
const ROLE = ["SUPER_ADMIN", "MEMBER"] as const

export const users = mysqlTable(USERS, {
    id: varchar("id", { length: 16 }).primaryKey(),
    username: varchar("username", { length: 225 }).notNull(),
    password: varchar("password", { length: 225 }).notNull(),
    role: mysqlEnum("role", ROLE).default("MEMBER"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})

export const images = mysqlTable(IMAGES, {
    id: varchar("id", { length: 16 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    md5: varchar("md5", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 16 }).notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    point: int("point").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})

export const imagesRelations = relations(images, ({ one }) => ({
    users: one(users, {
        fields: [images.userId],
        references: [users.id]
    })
}))