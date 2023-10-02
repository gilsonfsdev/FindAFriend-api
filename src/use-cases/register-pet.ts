import { petsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface registerPetUseCaseRequest {
  name: string
  description: string
  type: string
  age: string
  energy: string
  size: string
  independency: string
  city: string
  photo: string
  orgId: string
}

interface registerPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute({
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    photo,
    orgId,
  }: registerPetUseCaseRequest): Promise<registerPetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      description,
      type,
      age,
      energy,
      size,
      independency,
      city,
      photo,
      org_id: orgId,
    })

    return { pet }
  }
}
