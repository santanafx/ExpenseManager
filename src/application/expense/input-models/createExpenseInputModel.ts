import type { STATUS } from "../../../domain/expense/enums/status.js"

export class CreateExpenseInputModel {
  constructor(public readonly description: string, public readonly amount: number, public readonly categoryId: string, public readonly date: Date, public readonly userId: string, public readonly status: STATUS, public readonly notes: string) {
    this.description = description
    this.amount = amount
    this.categoryId = categoryId
    this.date = date
    this.userId = userId
    this.status = status
    this.notes = notes
  }
}