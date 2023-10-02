import { hash } from 'bcryptjs'
import { orgsRepository } from '../repositories/orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists'
import { Org } from '@prisma/client'

interface signUpUseCaseRequest {
  title: string
  president: string
  email: string
  cep: string
  adress: string
  password: string
  whatsapp: string
}

interface signUpUseCaseResponse {
  org: Org
}

export class SignUpUseCase {
  constructor(private orgsRepository: orgsRepository) {}

  async execute({
    title,
    president,
    password,
    email,
    whatsapp,
    adress,
    cep,
  }: signUpUseCaseRequest): Promise<signUpUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      title,
      president,
      email,
      cep,
      adress,
      password: passwordHash,
      whatsapp,
    })

    return { org }
  }
}
