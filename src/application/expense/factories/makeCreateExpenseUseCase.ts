import { ExpenseRepository } from '../../../infrastructure/persistence/expense/repository/expenseRepository.js'
import { CreateExpenseUseCase } from '../use-case/createExpenseUseCase.js'

export function makeCreateExpenseUseCase(): CreateExpenseUseCase {
  const expenseRepository = new ExpenseRepository()
  return new CreateExpenseUseCase(expenseRepository)
}
