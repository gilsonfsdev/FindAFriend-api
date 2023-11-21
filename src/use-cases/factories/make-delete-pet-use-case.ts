import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { DeletePetUseCase } from '../delete-pet'

export function MakeDeletePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const deletePetUseCase = new DeletePetUseCase(petsRepository)

  return deletePetUseCase
}
