import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { petsRepository } from '../pets-repository'

export class PrismaPetsRepository implements petsRepository {
  async findManyByCity(city: string) {
    const pets = await prisma.pet.findMany({
      where: {
        city,
      },
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
