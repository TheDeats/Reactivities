import { z } from "zod";
import { requiredString } from "../util/util";

export const loginSchema = z.object({
    email: requiredString('Email').pipe(z.email("Email")),
    password: z.string({error:'Password is required'}).min(6, {message: 'Password is required'})
})

export type LoginSchema = z.infer<typeof loginSchema>;