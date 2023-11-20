import { Prisma, Org } from '@prisma/client'

export interface orgsRepository {
  save(org: Org): Promise<Org>
  create(data: Prisma.OrgCreateInput): Promise<Org>
  findByEmail(email: string): Promise<Org | null>
  findById(id: string): Promise<Org | null>
}
