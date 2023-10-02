import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { RegisterPetUseCase } from '../register-pet'

export function MakeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const registerPetUseCase = new RegisterPetUseCase(petsRepository)

  return registerPetUseCase
}
