import { randomUUID } from "node:crypto";
import { Category } from "../../../domain/expense/entities/category.js";
import type { ICategoryRepository } from "../../../domain/expense/repositories/iCategoryRepository.js";
import type { CreateCategoryInputModel } from "../input-models/createCategoryInputModel.js";
import { CreateCategoryViewModel } from "../view-models/createCategoryViewModel.js";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) { }

  async execute(createCategoryInputModel: CreateCategoryInputModel) {
    const isCategoryNameDuplicated = await this.categoryRepository.findByName(createCategoryInputModel.name)

    if (isCategoryNameDuplicated) {
      throw new Error('Category name already exists.')
    }

    const category = new Category(randomUUID(), createCategoryInputModel.name, createCategoryInputModel.description, createCategoryInputModel.userId)

    const newCategory = await this.categoryRepository.create(category)

    return new CreateCategoryViewModel(
      newCategory.id, newCategory.description ?? "", newCategory.name, newCategory.userId
    )
  }
}