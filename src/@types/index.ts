import { users, images, settings } from "../model/schema"

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Upload = typeof images.$inferSelect
export type InsertUpload = typeof images.$inferInsert

export type InsertSetting = typeof settings.$inferInsert

export type Success<T> = {
    status: number
    data: T;
    metadata?: Metadata
    message: string;
}
export type Error = {
    status: number;
    type: string;
    message?: string;
    errors?: unknown;
}

export type Metadata = {
    page: number;
    limit: number;
    from: number;
    to: number;
    total_row: number;
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

export type Query = {
    page: string;
    sort_type: string;
    sort_key: string;
    user_search: string;
}