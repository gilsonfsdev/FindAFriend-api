import { prisma } from '../../lib/prisma'
import { Pet, Prisma } from '@prisma/client'
import { petsRepository } from '../pets-repository'

export class PrismaPetsRepository implements petsRepository {
  async delete(pet: Pet) {
    await prisma.pet.delete({
      where: {
        id: pet.id,
      },
    })
  }

  async save(pet: Pet) {
    const updatedPet = await prisma.pet.update({
      where: {
        id: pet.id,
      },
      data: pet,
    })

    return updatedPet
  }

  async findManyByFilters(data: Partial<Prisma.PetCreateManyOrgInput>) {
    const pets = await prisma.pet.findMany({
      where: data,
    })

    return pets
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
