import type { NextFunction, Request, Response } from 'express'
import ImageService from '../services/image.service'
import { mockSuccessResponse } from '../utils/mock'
import { StatusCodes } from 'http-status-codes'

export default class ImageController {

    static async listByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ImageService.listByUserId(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async add(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ImageService.add(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.OK,
                data: result,
                message: "Success add new image"
            })

        } catch (error) {
            next(error)
        }
    }

    static async updatePoint(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ImageService.updatePoint(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.CREATED,
                data: result,
                message: "Success update point image"
            })

        } catch (error) {
            next(error)
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const imageId = await ImageService.remove(req)
            return mockSuccessResponse(res, {
                status: StatusCodes.CREATED,
                data: null,
                message: `Success delete image with id ${imageId}`
            })

        } catch (error) {
            next(error)
        }
    }

}