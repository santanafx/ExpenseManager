import { CategoryRepository } from '../../../infrastructure/persistence/expense/repository/categoryRepository.js'
import { CreateCategoryUseCase } from '../use-case/createCategoryUseCase.js'

export function makeCreateCategoryUseCase(): CreateCategoryUseCase {
  const categoryRepository = new CategoryRepository()
  return new CreateCategoryUseCase(categoryRepository)
}
