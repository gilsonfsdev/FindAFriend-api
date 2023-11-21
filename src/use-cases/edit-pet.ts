import { petsRepository } from '@/repositories/pets-repository'
import { PetNotFoundError } from './errors/pet-not-found'
import { Pet } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials'

interface EditPetUseCaseRequest {
  org_id: string
  id: string
  name: string
  description: string
  type: string
  age: string
  energy: string
  size: string
  independency: string
  city: string
  photo: string
}

interface EditPetUseCaseReponse {
  pet: Pet
}

export class EditPetUseCase {
  constructor(private petsRepository: petsRepository) {}

  async execute({
    org_id,
    id,
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    photo,
  }: EditPetUseCaseRequest): Promise<EditPetUseCaseReponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    if (pet.org_id !== org_id) {
      throw new InvalidCredentialsError()
    }

    pet.name = name
    pet.description = description
    pet.type = type
    pet.age = age
    pet.energy = energy
    pet.size = size
    pet.independency = independency
    pet.city = city
    pet.photo = photo

    await this.petsRepository.save(pet)

    return {
      pet,
    }
  }
}
