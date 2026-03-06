import type { STATUS } from "../../../domain/expense/enums/status.js"

export class CreateExpepenseViewModel {
  constructor(public readonly id: string, public readonly description: string, public readonly amount: number, public readonly categoryId: string, public readonly date: Date, public readonly userId: string, public readonly status: STATUS, public readonly notes: string) {
    this.id = id
    this.description = description
    this.amount = amount
    this.categoryId = categoryId
    this.date = date
    this.userId = userId
    this.status = status
    this.notes = notes
  }
}