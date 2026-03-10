import type { STATUS } from "../../../domain/expense/enums/status.js"

export interface CreateExpepenseViewModel {
  id: string
  description: string
  amount: number
  categoryId: string
  date: Date
  userId: string
  status: STATUS
  notes: string
}