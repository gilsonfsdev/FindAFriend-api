import { Org } from '@prisma/client'
import { OrgNotFoundError } from './errors/org-not-found'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

interface profileOrgUseCaseRequest {
  id: string
}

interface profileOrgUseCaseResponse {
  org: Org
}

export class ProfileOrgUseCase {
  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async execute({
    id,
  }: profileOrgUseCaseRequest): Promise<profileOrgUseCaseResponse> {
    const org = await this.orgsRepository.findById(id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    return { org }
  }
}
