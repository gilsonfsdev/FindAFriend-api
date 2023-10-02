import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await orgsRepository.create({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: await hash('1234567', 6),
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    await expect(() =>
      sut.execute({
        email: 'teste@teste.com',
        password: '7654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong e-mail', async () => {
    await orgsRepository.create({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: await hash('1234567', 6),
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    await expect(() =>
      sut.execute({
        email: 'teste1@teste.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate ', async () => {
    await orgsRepository.create({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: await hash('1234567', 6),
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    const { org } = await sut.execute({
      email: 'teste@teste.com',
      password: '1234567',
    })

    expect(org.id).toEqual(expect.any(String))
  })
})
