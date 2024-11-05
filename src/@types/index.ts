import { users, images } from "../model/schema"

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Upload = typeof images.$inferSelect
export type InsertUpload = typeof images.$inferInsert

export type Error = {
    status: number;
    type: string;
    message?: string;
    errors?: unknown;
}

export type Success<T> = {
    status: number
    data: T;
    message: string;
}

export type Role = "SUPER_ADMIN" | "MEMBER"

export type JWTPayload = {
    user: {
        id: string,
        username: string,
        role: Role,
        createdAt: Date
    }
}
