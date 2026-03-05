import { Expense } from "../../../../domain/expense/entities/expense.js";
import { STATUS } from "../../../../domain/expense/enums/status.js";
import type { IExpenseRepository } from "../../../../domain/expense/repositories/iExpenseRepository.js";
import { prisma } from "../../db-context/database.js";
import { Status } from "../../prisma/generated/enums.js";
import type { ExpenseModel } from "../../prisma/generated/models.js";

export class ExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const createdExpense = await prisma.expense.create({
      data: {
        id: expense.id,
        amount: expense.amount,
        categoryId: expense.categoryId,
        date: expense.date,
        userId: expense.userId,
        status: this.mapStatusToDatabase(expense.status),
        notes: expense.notes || "",
        created_at: expense.created_at
      }
    })

    return this.mapToDomain(createdExpense)
  }

  async findById(id: string): Promise<Expense | null> {
    const prismaExpense = await prisma.expense.findUnique({
      where: { id }
    })
    
    if (!prismaExpense) {
      return null
    }

    return this.mapToDomain(prismaExpense)
  }

  private mapStatusToDatabase(status: STATUS): Status {
    const statusMap: Record<STATUS, Status> = {
      [STATUS.PENDING]: Status.PENDING,
      [STATUS.PAID]: Status.PAID,
      [STATUS.CANCELLED]: Status.CANCELLED,
      [STATUS.OVERDUE]: Status.OVERDUE,
    }
    return statusMap[status]
  }

  private mapStatusFromDatabase(status: Status): STATUS {
    const statusMap: Record<Status, STATUS> = {
      [Status.PENDING]: STATUS.PENDING,
      [Status.PAID]: STATUS.PAID,
      [Status.CANCELLED]: STATUS.CANCELLED,
      [Status.OVERDUE]: STATUS.OVERDUE,
    }
    return statusMap[status]
  }

  private mapToDomain(prismaExpense: ExpenseModel): Expense {
    const expense = new Expense(
      prismaExpense.id,
      prismaExpense.notes,
      prismaExpense.amount,
      prismaExpense.categoryId,
      prismaExpense.date,
      prismaExpense.userId,
      this.mapStatusFromDatabase(prismaExpense.status),
      prismaExpense.notes,
      prismaExpense.created_at,
      prismaExpense.updated_at
    )
    return expense
  }
}