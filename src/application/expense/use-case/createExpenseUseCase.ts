import { randomUUID } from "node:crypto";
import { Expense } from "../../../domain/expense/entities/expense.js";
import type { IExpenseRepository } from "../../../domain/expense/repositories/iExpenseRepository.js";
import type { CreateExpenseInputModel } from "../input-models/createExpenseInputModel.js";
import type { CreateExpepenseViewModel } from "../view-models/createExpenseViewModel.js";
import { AppError } from "../../common/errors/appError.js";

export class CreateExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) { }
  async execute(createExpenseInputModel: CreateExpenseInputModel): Promise<CreateExpepenseViewModel> {
    const isExpenseDuplicated = await this.expenseRepository.findByDescription(createExpenseInputModel.description)

    if (isExpenseDuplicated) {
      throw new AppError(400, 'This expense already exists with the same description')
    }

    const newExpense = new Expense({
      description: createExpenseInputModel.description,
      amount: createExpenseInputModel.amount,
      categoryId: createExpenseInputModel.categoryId,
      date: createExpenseInputModel.date,
      userId: createExpenseInputModel.userId,
      status: createExpenseInputModel.status,
      ...(createExpenseInputModel.notes !== undefined && { notes: createExpenseInputModel.notes }),
      created_at: new Date(),
    }, randomUUID())

    const createdExpense = await this.expenseRepository.create(newExpense)

    return {
      id: createdExpense.id,
      description: createdExpense.description,
      amount: createdExpense.amount,
      categoryId: createdExpense.categoryId,
      date: createdExpense.date,
      userId: createdExpense.userId,
      status: createdExpense.status,
      notes: createdExpense.notes ?? "",
    }
  }
}