import { Category } from "../../../../domain/expense/entities/category.js";
import type { ICategoryRepository } from "../../../../domain/expense/repositories/iCategoryRepository.js";
import { prisma } from "../../db-context/database.js";
import type { CategoryModel } from "../../prisma/generated/models.js";

export class CategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const createdCategory = await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description ?? "",
        userId: category.userId,
      }
    })

    return this.mapToDomain(createdCategory)
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: { name }
    })

    if (!category) {
      return null
    }

    return this.mapToDomain(category)
  }

  private mapToDomain(prismaCategory: CategoryModel): Category {
    return new Category({
      name: prismaCategory.name,
      description: prismaCategory.description,
      userId: prismaCategory.userId,
      created_at: prismaCategory.created_at,
      updated_at: prismaCategory.updated_at,
    }, prismaCategory.id)
  }
}