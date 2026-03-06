import z from "zod";
import { STATUS } from "../../../domain/expense/enums/status.js";

export const createExpenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  categoryId: z.string().min(1, "CategoryId is required"),
  date: z.string().min(1, "Date is required"),
  userId: z.string().min(1, "UserId is required"),
  status: z.nativeEnum(STATUS),
  notes: z.string().min(1, "Notes is required"),
})