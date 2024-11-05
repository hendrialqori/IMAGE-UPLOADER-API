import multer from "multer";
import { MAX_IMAGE_SIZE, ALLOWS_MIME_TYPE } from "../constant";
import { FileUploadError } from "./errors";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage()

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWS_MIME_TYPE.includes(file.mimetype as typeof ALLOWS_MIME_TYPE[number])) {
        cb(null, true)
    } else if (file.size > MAX_IMAGE_SIZE) {
        cb(null, false)
        cb(new FileUploadError(StatusCodes.BAD_REQUEST, "Max size only 3MB"))
    }
    else {
        cb(null, false)
        cb(new FileUploadError(415, "Only png, jpg and jpeg formats allowed!"))
    }
}

export const imageUpload = multer({
    storage,
    fileFilter
})



