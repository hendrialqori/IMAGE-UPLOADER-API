import { eq } from "drizzle-orm";
import { Request } from "express";
import { InsertUpload, JWTPayload } from "../@types";
import { Validation } from "../validation/validation";
import { ImageValidation } from "../validation/image.validation";
import { uuid } from "../utils/helpers";
import path from "path";
import { access, mkdir, writeFile } from "node:fs/promises";
import { db } from "../model/db";
import { users as usersTable, images as imagesTable } from "../model/schema";
import { ResponseError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { unlink } from "node:fs/promises";
import { io } from "../main";
import { LEADERBOARD } from "../constant";
import LeaderboardService from "./leaderboard.service";
import UserService from "./user.service";

export default class ImageService {

    private static uploadDirPath = path.join(__dirname, "..", "..", "_uploads")

    private static column = {
        id: imagesTable.id,
        title: imagesTable.title,
        point: imagesTable.point,
        // category
        user: {
            id: usersTable.id,
            username: usersTable.username
        },
        created_at: imagesTable.createdAt,
        updated_at: imagesTable.updatedAt
    }

    // get list image by user id
    static async listByUserId(req: Request) {
        const { userId } = req.params as { userId: string }

        const result =
            await db.select(ImageService.column)
                .from(imagesTable)
                .innerJoin(usersTable, eq(imagesTable.userId, usersTable.id))
                .where(eq(imagesTable.userId, userId))

        return result

    }

    static async add(req: Request) {
        const file = req.file
        const body = req.body as InsertUpload
        const userId = (req as Request & JWTPayload).user.id

        const { md5 } = Validation.validate(ImageValidation.ADD, body)

        // read or create if dir doesn't exists
        await ImageService.readOrCreateDir(ImageService.uploadDirPath)

        // check duplicate image by md5
        const image = await ImageService.checkImage(imagesTable.md5, md5)
        if (image) {
            throw new ResponseError(StatusCodes.UNPROCESSABLE_ENTITY, "Cannot upload duplicate image")
        }

        // setup store image
        const imageName = `${md5}-${file.originalname}`
        const imageBuffer = file.buffer
        const imagePath = path.join(this.uploadDirPath, imageName);

        // store image file into directory
        await writeFile(imagePath, imageBuffer);

        const payload: InsertUpload = {
            id: uuid(),
            title: imageName,
            md5,
            userId
        }

        const [id] =
            await db.insert(imagesTable).values(payload).$returningId()


        return { ...id, ...payload }
    }


    static async updatePoint(req: Request) {
        const { imageId } = req.params as { imageId: string }
        const body = req.body as { point: number }

        // validation
        const updateRequest = Validation.validate(ImageValidation.UPDATE, body) as unknown as InsertUpload

        // check image exists
        const image = await ImageService.checkImage(imagesTable.id, imageId)
        if (!image) {
            throw new ResponseError(StatusCodes.NOT_FOUND, `Image not found with id ${imageId}`)
        }

        await db.update(imagesTable).set(updateRequest).where(eq(imagesTable.id, imageId))


        io.emit(LEADERBOARD, await UserService.list())

        return { id: image.id, title: image.title, point: body.point }

    }

    static async remove(req: Request) {
        const { imageId } = req.params as { imageId: string }

        // check image exists
        const image = await ImageService.checkImage(imagesTable.id, imageId)
        if (!image) {
            throw new ResponseError(StatusCodes.NOT_FOUND, `Image not found with id ${imageId}`)
        }

        const imageDirPath = path.join(ImageService.uploadDirPath, image.title)

        await db.delete(imagesTable).where(eq(imagesTable.id, image.id))

        await unlink(imageDirPath)

        return image.id
    }

    private static async checkImage<T extends {}>(column: MySqlColumn, value: T) {
        const [result] = await db.select().from(imagesTable).where(eq(column, value))
        return result
    }

    private static async readOrCreateDir(dirPath: string) {
        try {
            await access(dirPath)
        } catch (error) {
            await mkdir(dirPath, { recursive: true })
        }
    }


}