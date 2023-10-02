import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { orgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements orgsRepository {
  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })

    return org
  }
}
