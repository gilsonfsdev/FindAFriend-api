import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { EditPetUseCase } from '../edit-pet'

export function MakeEditPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const editPetUseCase = new EditPetUseCase(petsRepository)

  return editPetUseCase
}
