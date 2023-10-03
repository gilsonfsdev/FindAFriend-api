import { randomUUID } from 'crypto'
import { Prisma, Pet } from '@prisma/client'
import { petsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements petsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      type: data.type,
      age: data.age,
      energy: data.energy,
      size: data.size,
      independency: data.independency,
      city: data.city,
      photo: data.photo,
      org_id: data.org_id,
    }

    this.items.push(pet)

    return pet
  }
}
