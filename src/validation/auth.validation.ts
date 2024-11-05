import { z, ZodType } from "zod";

export class AuthValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1)
            .max(20, { message: "Max only 20 character(s)" })
            .regex(/^\S*$/, { message: "Whitespace not allowed" }),
        password: z.string().min(1).max(225)
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().max(100),
        password: z.string().min(1).max(225)
    })
}

