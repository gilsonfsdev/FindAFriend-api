import { petsRepository } from '@/repositories/pets-repository'
import { PetNotFoundError } from './errors/pet-not-found'

interface DeletePetUseCaseRequest {
  id: string
}

export class DeletePetUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute({ id }: DeletePetUseCaseRequest) {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    await this.petsRepository.delete(pet)

    return {}
  }
}
