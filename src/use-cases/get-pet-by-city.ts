import { petsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface getPetByCityUseCaseRequest {
  city: string
}

interface getPetByCityUseCaseResponse {
  pets: Pet[]
}

export class GetPetByCityUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute({
    city,
  }: getPetByCityUseCaseRequest): Promise<getPetByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity(city)

    return { pets }
  }
}
