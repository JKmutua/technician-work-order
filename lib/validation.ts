import { z } from 'zod';

export const createWorkOrderSchema = z.object({
    title: z.string()
        .min(2, 'Title must be at least 2 characters')
        .max(80, 'Title must be at most 80 characters'),
    description: z.string()
        .max(2000, 'Description must be at most 2000 characters'),
    priority: z.enum(['Low', 'Medium', 'High'], {
        errorMap: () => ({ message: 'Priority must be Low, Medium, or High' })
    })
});

export const updateWorkOrderSchema = z.object({
    title: z.string()
        .min(2, 'Title must be at least 2 characters')
        .max(80, 'Title must be at most 80 characters')
        .optional(),
    description: z.string()
        .max(2000, 'Description must be at most 2000 characters')
        .optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    status: z.enum(['Open', 'In Progress', 'Done']).optional()
});

export type CreateWorkOrderData = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderData = z.infer<typeof updateWorkOrderSchema>;