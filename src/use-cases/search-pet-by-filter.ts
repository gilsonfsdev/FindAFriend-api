import { petsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface searchPetByFiltersUseCaseRequest {
  age?: string
  size?: string
  type?: string
  city?: string
}

interface searchPetByFiltersUseCaseResponse {
  pets: Pet[]
}

export class SearchPetByFiltersUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute(
    data: searchPetByFiltersUseCaseRequest,
  ): Promise<searchPetByFiltersUseCaseResponse> {
    const pets = await this.petsRepository.findManyByFilters(data)

    return { pets }
  }
}
