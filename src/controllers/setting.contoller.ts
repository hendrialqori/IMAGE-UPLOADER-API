import { Request, Response, NextFunction } from "express";
import SettingService from "../services/setting.service";
import { mockSuccessResponse } from "../utils/mock";
import { StatusCodes } from "http-status-codes";

export default class SettingController {

    static async eventStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await SettingService.eventStatus()

            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: { status: result.value },
                message: "Success"
            })
        } catch (error) {
            next(error)
        }
    }

    static async eventUpdate(req: Request, res: Response, next: NextFunction) {
        try {

            const result = await SettingService.eventUpdate(req)

            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: null,
                message: `Success make event ${result}`
            })
        } catch (error) {
            next(error)
        }
    }
}