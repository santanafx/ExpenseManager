import type { Category } from "../entities/category.js";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>
  findByName(name: string): Promise<Category | null>
}