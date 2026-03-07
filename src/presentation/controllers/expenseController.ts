import { Router, type Request, type Response } from "express";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { createExpenseCategorySchema } from "../validators/expenses/createExpenseCategorySchema.js";
import { createExpenseSchema } from "../validators/expenses/createExpenseSchema.js";
import { CreateCategoryInputModel } from "../../application/expense/input-models/createCategoryInputModel.js";
import { CategoryRepository } from "../../infrastructure/persistence/expense/repository/categoryRepository.js";
import { CreateCategoryUseCase } from "../../application/expense/use-case/createCategoryUseCase.js";
import z from "zod";
import { CreateExpenseInputModel } from "../../application/expense/input-models/createExpenseInputModel.js";
import { JWTService } from "../../infrastructure/services/jwtService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const jwtService = new JWTService()
const authMiddlewareJwt = authMiddleware(jwtService)

export const expenseRouter = Router()

expenseRouter.post('/expense', authMiddlewareJwt, (req: Request, res: Response) => {
  try {
    const validatedExpense = createExpenseSchema.parse(req.body)

    const newExpense = new CreateExpenseInputModel(
      validatedExpense.description, Number(validatedExpense.amount), validatedExpense.categoryId, new Date(validatedExpense.date), validatedExpense.userId, validatedExpense.status, validatedExpense.notes
    )

    return res.status(201).json(newExpense)
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

    const newCategory = new CreateCategoryInputModel(
      validatedCategory.name, validatedCategory.description ?? "", validatedCategory.userId
    )

    const categoryRepository = new CategoryRepository()
    const categoryUseCase = new CreateCategoryUseCase(categoryRepository)
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