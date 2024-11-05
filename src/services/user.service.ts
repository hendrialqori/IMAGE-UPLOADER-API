import { desc, eq, sql } from "drizzle-orm";
import { db } from "../model/db";
import { users as usersTable, images as imagesTable } from "../model/schema";

export default class UserService {

    private static column = {
        id: usersTable.id,
        username: usersTable.username,
        role: usersTable.role,
        point: sql`CAST(COALESCE(SUM(${imagesTable.point}), 0) AS SIGNED)`.as("point")
    }

    static async list() {
        const result =
            await db.select(UserService.column)
                .from(usersTable)
                .leftJoin(imagesTable, eq(imagesTable.userId, usersTable.id))
                .groupBy(usersTable.id)
                //@ts-ignore
                .orderBy(desc(sql`CAST(COALESCE(SUM(${imagesTable.point}), 0) AS SIGNED)`))
                .limit(10)

        return result
    }

}