import { Router, type Request, type Response } from "express";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { createExpenseCategorySchema } from "../validators/expenses/createExpenseCategorySchema.js";
import { createExpenseSchema } from "../validators/expenses/createExpenseSchema.js";
import type { CreateCategoryInputModel } from "../../application/expense/input-models/createCategoryInputModel.js";
import type { CreateExpenseInputModel } from "../../application/expense/input-models/createExpenseInputModel.js";
import z from "zod";
import { JWTService } from "../../infrastructure/services/jwtService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { makeCreateExpenseUseCase } from "../../application/expense/factories/makeCreateExpenseUseCase.js";
import { makeCreateCategoryUseCase } from "../../application/expense/factories/makeCreateCategoryUseCase.js";

const jwtService = new JWTService()
const authMiddlewareJwt = authMiddleware(jwtService)

export const expenseRouter = Router()

expenseRouter.post('/expense', authMiddlewareJwt, async (req: Request, res: Response) => {
  try {
    const validatedExpense = createExpenseSchema.parse(req.body)

    const input: CreateExpenseInputModel = {
      description: validatedExpense.description,
      amount: Number(validatedExpense.amount),
      categoryId: validatedExpense.categoryId,
      date: new Date(validatedExpense.date),
      userId: validatedExpense.userId,
      status: validatedExpense.status,
      notes: validatedExpense.notes,
    }

    const createExpenseUseCase = makeCreateExpenseUseCase()
    const expenseViewModel = await createExpenseUseCase.execute(input)

    return res.status(201).json(expenseViewModel)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues
      })
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

expenseRouter.post('/expense/category', authMiddlewareJwt, adminOnly, async (req: Request, res: Response) => {
  try {
    const validatedCategory = createExpenseCategorySchema.parse(req.body)

    const newCategory: CreateCategoryInputModel = {
      name: validatedCategory.name,
      ...(validatedCategory.description !== undefined && { description: validatedCategory.description }),
      userId: validatedCategory.userId,
    }

    const categoryUseCase = makeCreateCategoryUseCase()
    const categoryViewModel = await categoryUseCase.execute(newCategory)

    return res.status(201).json(categoryViewModel)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues
      })
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})