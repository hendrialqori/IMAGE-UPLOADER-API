import { mysqlTable, varchar, boolean, timestamp, mysqlEnum, int, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

const USERS = "users" as const;
const IMAGES = "images" as const
const SETTINGS = "settings" as const
const ROLE = ["SUPER_ADMIN", "MEMBER"] as const
const SETTING_VALUE = ["ON", "OFF"] as const

export const users = mysqlTable(USERS, {
    id: varchar("id", { length: 16 }).primaryKey(),
    username: varchar("username", { length: 225 }).notNull(),
    password: varchar("password", { length: 225 }).notNull(),
    role: mysqlEnum("role", ROLE).default("MEMBER"),
    isSuspend: boolean("is_suspend").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})

export const images = mysqlTable(IMAGES, {
    id: varchar("id", { length: 16 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    md5: varchar("md5", { length: 255 }).unique().notNull(),
    type: text("type").notNull(),
    userId: varchar("user_id", { length: 16 }).notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    point: int("point").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})

export const imagesRelations = relations(images, ({ one }) => ({
    users: one(users, {
        fields: [images.userId],
        references: [users.id]
    })
}))

export const settings = mysqlTable(SETTINGS, {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    value: mysqlEnum("value", SETTING_VALUE).default("ON"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})