import { PrismaPetsRepository } from '@/repositories/prisma/pisma-pet-repository'
import { ProfilePetUseCase } from '../profile-pet'

export function MakeProfilePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const profilePetUseCase = new ProfilePetUseCase(petsRepository)

  return profilePetUseCase
}
