import { Entity } from "../../common/entity.js"

interface CategoryProps {
  name: string
  description?: string
  userId: string
  created_at: Date
  updated_at?: Date
}

export class Category extends Entity<CategoryProps> {
  constructor(props: CategoryProps, id: string) {
    super(props, id)
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Category name cannot be empty')
    }
  }

  get name(): string { return this.props.name }
  get description(): string | undefined { return this.props.description }
  get userId(): string { return this.props.userId }
  get created_at(): Date { return this.props.created_at }
  get updated_at(): Date | undefined { return this.props.updated_at }
}