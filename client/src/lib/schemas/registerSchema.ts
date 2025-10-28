import z from "zod";
import { requiredString } from "../util/util";

export const registerSchema = z.object({
    email: requiredString('Email').pipe(z.email("Email")),
    displayName: requiredString('Display Name'),
    password: requiredString('Password')
})

export type RegisterSchema = z.infer<typeof registerSchema>