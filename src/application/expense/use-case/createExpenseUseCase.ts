import { randomUUID } from "node:crypto";
import { Expense } from "../../../domain/expense/entities/expense.js";
import type { ExpenseRepository } from "../../../infrastructure/persistence/expense/repository/expenseRepository.js";
import type { CreateExpenseInputModel } from "../input-models/createExpenseInputModel.js";
import { CreateExpepenseViewModel } from "../view-models/createExpenseViewModel.js";

export class CreateExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) { }
  async execute(createExpenseInputModel: CreateExpenseInputModel) {
    const isExpenseDuplicated = await this.expenseRepository.findByDescription(createExpenseInputModel.description)

    if (isExpenseDuplicated) {
      throw new Error('This expense already exists with the same description')
    }

    const newExpense = new Expense(randomUUID(), createExpenseInputModel.description, createExpenseInputModel.amount, createExpenseInputModel.categoryId, createExpenseInputModel.date, createExpenseInputModel.userId, createExpenseInputModel.status, createExpenseInputModel.notes)

    const createdExpense = await this.expenseRepository.create(newExpense)

    return new CreateExpepenseViewModel(createdExpense.id, createdExpense.description, createdExpense.amount, createdExpense.categoryId, createdExpense.date, createdExpense.userId, createdExpense.status, createdExpense.notes ?? "")
  }
}