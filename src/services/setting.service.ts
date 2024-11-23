import { eq } from "drizzle-orm";
import { db } from "../model/db";
import { settings as settingsTable } from "../model/schema";
import { ResponseError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { InsertSetting } from "../@types";

export default class SettingService {

    static readonly EVENT = "event"

    static async eventStatus() {

        const [result] =
            await db.select().from(settingsTable).where(eq(settingsTable.name, SettingService.EVENT))

        if (!result) {
            throw new ResponseError(StatusCodes.NOT_FOUND, "There's no property named event")
        }

        return result
    }

    static async eventUpdate(req: Request) {
        const body = req.body as { status: "ON" | "OFF" } // ON | OFF

        const payload = { value: body.status } as unknown as InsertSetting

        // check first, is there collection named event in table settings
        await SettingService.eventStatus()

        await db.update(settingsTable).set(payload).where((eq(settingsTable.name, SettingService.EVENT)))

        return body.status

    }
}