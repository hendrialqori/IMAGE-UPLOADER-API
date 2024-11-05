import { type MySqlColumn } from "drizzle-orm/mysql-core";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { db } from "../model/db";
import { users as usersTable, images as imagesTable } from "../model/schema";

import { Validation } from "../validation/validation";
import { AuthValidation } from "../validation/auth.validation";
import { ResponseError } from "../utils/errors";

import type { InsertUser, JWTPayload } from "../@types";
import { Request } from "express";
import { uuid } from "../utils/helpers";
import { SECRET_KEY } from "../constant";


export default class AuthService {

    private static column = {
        user: {
            id: usersTable.id,
            username: usersTable.username,
            role: usersTable.role,
            created_at: imagesTable.createdAt,
            updated_at: imagesTable.updatedAt
        },
        images: {
            id: imagesTable.id,
            title: imagesTable.title,
            point: imagesTable.point
        }
    }

    static async login(req: Request) {

        const requestBody = req.body as Omit<InsertUser, "id">

        // administratorMeggie
        const loginRequest = Validation.validate(AuthValidation.LOGIN, requestBody)

        const [user] = await AuthService.selectUserIfExists(
            usersTable.username, loginRequest.username
        )
        if (!user) {
            throw new ResponseError(404, 'User not found!')
        }

        // password match checker
        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
        if (!isPasswordValid) {
            throw new ResponseError(400, "Wrong password!")
        }

        // generate jwt token
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt
        }
        const expiresIn = 60 * 60 * 24 * 30 // 30 days

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn
        })

        return { ...payload, access_token: token }
    }

    static async register(request: InsertUser) {
        const registerRequest = Validation.validate(AuthValidation.REGISTER, request)

        const [userByName] = await AuthService.selectUserIfExists(
            usersTable.username, registerRequest.username
        )

        if (userByName) {
            throw new ResponseError(400, "Username already exists!")
        }

        const genSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(registerRequest.password, genSalt)

        const payload: InsertUser = {
            id: uuid(),
            username: registerRequest.username,
            password: hashPassword
        }

        const [newUser] =
            await db
                .insert(usersTable)
                .values(payload)
                .$returningId()

        return { ...newUser, ...registerRequest }
    }

    static async credential(req: Request) {
        const userId = (req as Request & JWTPayload).user.id

        const result =
            await db.select(AuthService.column)
                .from(imagesTable)
                .innerJoin(usersTable, eq(imagesTable.userId, usersTable.id))
                .where(eq(imagesTable.userId, userId))

        const totalPoint = result.map((res) => res.images.point).reduce((acc, current) => acc + current, 0)

        return { user: result[0].user, point: totalPoint }
    }


    private static async selectUserIfExists(columTable: MySqlColumn, columnSelect: string) {
        return await db.
            select()
            .from(usersTable)
            .where(eq(columTable, columnSelect))
    }

}