import { Entity } from "../../common/entity.js"
import type { STATUS } from "../enums/status.js"

interface ExpenseProps {
  description: string
  amount: number
  categoryId: string
  date: Date
  userId: string
  status: STATUS
  notes?: string
  created_at: Date
  updated_at?: Date
}

export class Expense extends Entity<ExpenseProps> {
  constructor(props: ExpenseProps, id: string) {
    super(props, id)
    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Description cannot be empty')
    }
    if (props.amount <= 0) {
      throw new Error('Amount must be positive')
    }
  }

  get description(): string { return this.props.description }
  get amount(): number { return this.props.amount }
  get categoryId(): string { return this.props.categoryId }
  get date(): Date { return this.props.date }
  get userId(): string { return this.props.userId }
  get status(): STATUS { return this.props.status }
  get notes(): string | undefined { return this.props.notes }
  get created_at(): Date { return this.props.created_at }
  get updated_at(): Date | undefined { return this.props.updated_at }
}