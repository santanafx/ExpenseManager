export class CreateCategoryViewModel {
  constructor(public readonly id: string, public readonly name: string, public readonly description: string, public readonly userId: string) {
    this.id = id
    this.name = name
    this.description = description
    this.userId = userId
  }
}