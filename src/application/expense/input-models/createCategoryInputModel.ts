export class CreateCategoryInputModel {
  constructor(public readonly name: string, public readonly description: string, public readonly userId: string) {
    this.name = name
    this.description = description
    this.userId = userId
  }
}