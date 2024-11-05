import type { NextFunction, Request, Response } from 'express'
import { mockSuccessResponse } from '../utils/mock'
import { StatusCodes } from 'http-status-codes'
import UserService from '../services/user.service'

export default class UserController {

    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.list()
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }
}