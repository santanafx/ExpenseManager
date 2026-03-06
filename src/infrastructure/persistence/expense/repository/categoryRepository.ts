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
    const category = new Category(
      prismaCategory.id,
      prismaCategory.name,
      prismaCategory.description,
      prismaCategory.userId,
      prismaCategory.created_at,
      prismaCategory.updated_at
    )
    return category
  }
}