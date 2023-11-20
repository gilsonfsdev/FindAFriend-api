import { orgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { OrgNotFoundError } from './errors/org-not-found'

interface EditOrgUseCaseRequest {
  id: string
  title: string
  president: string
  email: string
  cep: string
  adress: string
  whatsapp: string
  password: string
}

interface EditOrgUseCaseReponse {
  org: Org
}

export class EditOrgUseCase {
  constructor(private orgsRepository: orgsRepository) {}

  async execute({
    id,
    president,
    title,
    adress,
    email,
    cep,
    whatsapp,
    password,
  }: EditOrgUseCaseRequest): Promise<EditOrgUseCaseReponse> {
    const org = await this.orgsRepository.findById(id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    org.president = president
    org.title = title
    org.adress = adress
    org.email = email
    org.cep = cep
    org.whatsapp = whatsapp
    org.password = password

    await this.orgsRepository.save(org)

    return {
      org,
    }
  }
}
