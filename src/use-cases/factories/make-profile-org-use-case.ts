import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { ProfileOrgUseCase } from '../profile-org'

export function MakeProfileOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const profileOrgsUseCase = new ProfileOrgUseCase(orgsRepository)

  return profileOrgsUseCase
}
