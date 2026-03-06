export class CreateCategoryInputModel {
  constructor(public readonly name: string, public readonly description: string, public readonly userId: string) {
    this.description = description
    this.name = name
    this.userId = userId
  }
}