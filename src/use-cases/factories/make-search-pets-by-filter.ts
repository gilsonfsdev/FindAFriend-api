import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { SearchPetByFiltersUseCase } from '../search-pet-by-filter'

export function MakeSearchPetByFiltersUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const searchPetByFiltersUseCase = new SearchPetByFiltersUseCase(
    petsRepository,
  )

  return searchPetByFiltersUseCase
}
