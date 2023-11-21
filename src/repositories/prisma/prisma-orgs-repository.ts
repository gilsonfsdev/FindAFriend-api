import { prisma } from '../../lib/prisma'
import { Org, Prisma } from '@prisma/client'
import { orgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements orgsRepository {
  async save(org: Org) {
    const updatedOrg = await prisma.org.update({
      where: {
        id: org.id,
      },
      data: org,
    })

    return updatedOrg
  }

  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    })

    return org
  }

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
