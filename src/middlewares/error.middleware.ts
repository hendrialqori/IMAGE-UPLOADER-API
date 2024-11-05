import type { Request, Response, NextFunction } from "express";
import { ZodError } from 'zod'
import { AuthenticationError, ResponseError, FileUploadError } from "../utils/errors";
import { winstonLogger } from "../utils/helpers";
import { StatusCodes } from "http-status-codes";
import { mockErrorResponse } from "../utils/mock";

const VALIDATION_ERROR = "VALIDATION_ERROR"
const RESPONSE_ERROR = "RESPONSE_ERROR"
const UNKNOWN_ERROR = "UNKNOWN_ERROR"
const AUTH_ERROR = "AUTH_ERROR"
const FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR"

export function errorMiddleware(error: Error, request: Request, response: Response, _next: NextFunction) {
    if (error instanceof ZodError) {

        winstonLogger.error(VALIDATION_ERROR, {
            ip: request.ip,
            message: error.stack
        })

        mockErrorResponse(response, {
            status: StatusCodes.NOT_FOUND,
            type: VALIDATION_ERROR,
            message: error.message,
            errors: error.flatten().fieldErrors
        })


    } else if (error instanceof ResponseError) {
        winstonLogger.error(RESPONSE_ERROR, {
            message: error.stack
        })

        mockErrorResponse(response, {
            status: error.status,
            type: RESPONSE_ERROR,
            message: error.message
        })

    }
    else if (error instanceof AuthenticationError) {
        winstonLogger.error(AUTH_ERROR, {
            message: error.stack
        })

        mockErrorResponse(response, {
            status: error.status,
            type: AUTH_ERROR,
            message: error.message
        })

    } else if (error instanceof FileUploadError) {
        winstonLogger.error(FILE_UPLOAD_ERROR, {
            message: error.stack
        })

        mockErrorResponse(response, {
            status: error.status,
            type: FILE_UPLOAD_ERROR,
            message: error.message
        })

    } else {
        winstonLogger.error(UNKNOWN_ERROR, {
            message: error.stack
        })

        mockErrorResponse(response, {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            type: UNKNOWN_ERROR,
            message: error.message
        })

    }

}