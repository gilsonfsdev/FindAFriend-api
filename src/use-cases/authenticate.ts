import { compare } from 'bcryptjs'
import { orgsRepository } from '../repositories/orgs-repository'
import { Org } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials'

interface authenticateUseCaseRequest {
  email: string
  password: string
}

interface authenticaUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: orgsRepository) {}

  async execute({
    password,
    email,
  }: authenticateUseCaseRequest): Promise<authenticaUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, org.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
