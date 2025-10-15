import {z} from 'zod';

export const activitySchema = z.object({
    title: z.string().min(1, {message: 'Title is required'})
})

export type ActivitySchema = z.infer<typeof activitySchema>;