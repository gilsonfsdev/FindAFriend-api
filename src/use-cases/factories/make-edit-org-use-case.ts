import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { EditOrgUseCase } from '../edit-org'

export function MakeEditOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const editOrgUseCase = new EditOrgUseCase(orgsRepository)

  return editOrgUseCase
}
