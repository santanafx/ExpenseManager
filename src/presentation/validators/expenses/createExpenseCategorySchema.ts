import z from "zod";

export const createExpenseCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  descrition: z.string().optional(),
  userId: z.string().min(1, "Name is required"),
})