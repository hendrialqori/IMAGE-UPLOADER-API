import { Request } from "express";
import { asc, desc, eq, like, not, sql, and } from "drizzle-orm";
import { db } from "../model/db";
import { users as usersTable, images as imagesTable } from "../model/schema";
import { Query, Metadata, InsertUser } from "../@types";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { ResponseError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";

export default class UserService {

    private static LIST_COLUMN = {
        id: usersTable.id,
        username: usersTable.username,
        point: sql`CAST(COALESCE(SUM(${imagesTable.point}), 0) AS SIGNED)`.as("point"),
        total_upload: sql`CAST(COALESCE(COUNT(${imagesTable.id}), 0) AS SIGNED)`.as("total_upload"),
        is_suspend: usersTable.isSuspend

    }

    private static LEADERBOARD_COLUMN = {
        id: usersTable.id,
        username: usersTable.username,
        role: usersTable.role,
        point: sql`CAST(COALESCE(SUM(${imagesTable.point}), 0) AS SIGNED)`.as("point")
    }

    static async list(req: Request) {
        const query = req.query as unknown as Query

        // query params
        const limit = 10;
        const page = Number(query.page);
        const offset = Number((page - 1) * limit)
        const sortType = query.sort_type ?? "UNKNOWN" // ASC | DESC | UNKNOWN
        const sortKey = query.sort_key ?? "username"
        const user_search = query.user_search ?? ""

        const groupMapping = {
            "ASC": asc(UserService.LIST_COLUMN[sortKey]),
            "DESC": desc(UserService.LIST_COLUMN[sortKey]),
            "UNKNOWN": null
        }

        const groupClause = groupMapping[sortType]

        const users = await db.select(UserService.LIST_COLUMN)
            .from(usersTable)
            .leftJoin(imagesTable, eq(imagesTable.userId, usersTable.id))
            .orderBy(groupClause)
            .groupBy(usersTable.id)
            .where(and(like(usersTable.username, `%${user_search}%`), not(eq(usersTable.role, "SUPER_ADMIN"))))
            .limit(limit)
            .offset(offset)

        const [total_users] = await db.select({ count: sql<number>`COUNT(*)` })
            .from(usersTable)
            .where(and(like(usersTable.username, `%${user_search}%`), not(eq(usersTable.role, "SUPER_ADMIN"))))

        const meta: Metadata = {
            page,
            from: offset + 1,
            to: Math.min(limit * page, total_users.count),
            limit,
            total_row: total_users.count
        }

        return { users, meta }
    }

    static async leaderboard() {
        const result =
            await db.select(UserService.LEADERBOARD_COLUMN)
                .from(usersTable)
                .leftJoin(imagesTable, eq(imagesTable.userId, usersTable.id))
                .groupBy(usersTable.id)
                .orderBy(desc(sql`CAST(COALESCE(SUM(${imagesTable.point}), 0) AS SIGNED)`))
                .limit(10)

        return result
    }

    static async suspend_user(req: Request) {
        const { userId } = req.params as { userId: string };

        const user = await UserService.checkUser(usersTable.id, userId);
        if (user.role === "SUPER_ADMIN") {
            throw new ResponseError(StatusCodes.BAD_REQUEST, "Superadmin cannot suspended")
        }

        const payload = {
            isSuspend: true
        } as InsertUser & { isSuspend: boolean }

        await db.update(usersTable).set(payload).where(eq(usersTable.id, userId))
    }

    static async recovery_user(req: Request) {
        const { userId } = req.params as { userId: string };

        const payload = {
            isSuspend: false
        } as InsertUser & { isSuspend: boolean }

        await db.update(usersTable).set(payload).where(eq(usersTable.id, userId))
    }

    private static async checkUser<T extends {}>(column: MySqlColumn, value: T) {
        const [result] = await db.select().from(usersTable).where(eq(column, value))
        return result
    }

}