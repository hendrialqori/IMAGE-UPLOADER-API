import { type Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { type InsertUser } from "../@types";
import { StatusCodes } from "http-status-codes";
import { mockSuccessResponse } from "../utils/mock";


export default class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as InsertUser
            const response = await AuthService.register(request)

            return res
                .status(200)
                .json({ data: response, message: "Successfully add new user:)" })

        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { access_token, username, role } = await AuthService.login(req)

            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: {
                    username,
                    role,
                    token: access_token
                },
                message: `Hello ${username}:) You're loggin now`
            })

        } catch (error) {
            next(error)
        }
    }

    static async credential(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.credential(req)

            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async checkIsSuspend(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.checkIsSuspend(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: null,
                message: "You can upload image"
            })

        } catch (error) {
            next(error)
        }
    }
}