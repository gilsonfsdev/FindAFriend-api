import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { GetPetByCityUseCase } from '../get-pet-by-city'

export function MakeGetPetByCityUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const getPetByCityUseCase = new GetPetByCityUseCase(petsRepository)

  return getPetByCityUseCase
}
