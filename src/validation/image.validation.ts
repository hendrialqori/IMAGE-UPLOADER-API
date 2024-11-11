import { z, ZodType } from "zod";

export class ImageValidation {
    static readonly ADD: ZodType = z.object({
        md5: z.string(),
        type: z.string()
    })

    static readonly UPDATE: ZodType = z.object({
        point: z.number()
            .nonnegative({ message: "Negative number not allowed"})
            .max(100, { message: "Max only 100 point" })
    })
}

