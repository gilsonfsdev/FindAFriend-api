import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { petsRepository } from '../pets-repository'

export class PrismaPetsRepository implements petsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
