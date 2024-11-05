import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { AuthenticationError } from "../utils/errors";
import { SECRET_KEY } from "../constant";
import { StatusCodes } from "http-status-codes";
import type { JWTPayload, Role } from "../@types";


export async function accessValidation(req: Request, _res: Response, next: NextFunction) {
    try {
        // header
        const authorization = req.headers.authorization
        // token
        const token = authorization.split(" ")[1]
        // verify token
        const payload = jwt.verify(token, SECRET_KEY) as JWTPayload["user"]

        (req as Request & JWTPayload).user = payload
        // console.log((req as Request & JWTPayload).user.id)

        next()

    } catch (error) {
        next(new AuthenticationError(StatusCodes.UNAUTHORIZED, "Unauthorized"))
    }
}

export function authorizeRole(allowedRoles: Role[]) {
    return (req: Request, _res: Response, next: NextFunction) => {

        const userRole = (req as Request & JWTPayload).user.role

        if (!allowedRoles.includes(userRole)) {
            next(new AuthenticationError(StatusCodes.UNAUTHORIZED, `Only ${allowedRoles.join(", ")} can be access this API`))
        }

        next()
    }
}