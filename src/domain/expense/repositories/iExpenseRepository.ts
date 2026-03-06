import type { Expense } from "../entities/expense.js";

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>
  findByDescription(description: string): Promise<Expense | null>
}