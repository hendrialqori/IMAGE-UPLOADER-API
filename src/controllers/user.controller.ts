import type { NextFunction, Request, Response } from 'express'
import { mockSuccessResponse } from '../utils/mock'
import { StatusCodes } from 'http-status-codes'
import UserService from '../services/user.service'

export default class UserController {

    static async leaderboard(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.leaderboard()
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const { users, meta } = await UserService.list(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: users,
                metadata: meta,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async suspend_user(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.suspend_user(req)

            return mockSuccessResponse(res, {
                status: StatusCodes.CREATED,
                data: null,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async recovery_user(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.recovery_user(req)

            return mockSuccessResponse(res, {
                status: StatusCodes.CREATED,
                data: null,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }
}