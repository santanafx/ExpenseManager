import { randomUUID } from "node:crypto";
import { Category } from "../../../domain/expense/entities/category.js";
import type { ICategoryRepository } from "../../../domain/expense/repositories/iCategoryRepository.js";
import type { CreateCategoryInputModel } from "../input-models/createCategoryInputModel.js";
import type { CreateCategoryViewModel } from "../view-models/createCategoryViewModel.js";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) { }

  async execute(createCategoryInputModel: CreateCategoryInputModel): Promise<CreateCategoryViewModel> {
    const isCategoryNameDuplicated = await this.categoryRepository.findByName(createCategoryInputModel.name)

    if (isCategoryNameDuplicated) {
      throw new Error('Category name already exists.')
    }

    const category = new Category({
      name: createCategoryInputModel.name,
      ...(createCategoryInputModel.description !== undefined && { description: createCategoryInputModel.description }),
      userId: createCategoryInputModel.userId,
      created_at: new Date(),
    }, randomUUID())

    const newCategory = await this.categoryRepository.create(category)

    return {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description ?? "",
      userId: newCategory.userId,
    }
  }
}