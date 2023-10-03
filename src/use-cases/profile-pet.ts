import { petsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { PetNotFoundError } from './errors/pet-not-found'

interface profilePetUseCaseRequest {
  id: string
}

interface profilePetUseCaseResponse {
  pet: Pet
}

export class ProfilePetUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute({
    id,
  }: profilePetUseCaseRequest): Promise<profilePetUseCaseResponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    return { pet }
  }
}
