import { beforeEach, describe, expect, it } from 'vitest'
import { SignUpUseCase } from './sign-up'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists'
import { orgsRepository } from '@/repositories/orgs-repository'

let orgsRepository: InMemoryOrgsRepository
let sut: SignUpUseCase

describe('Sign-Up Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new SignUpUseCase(orgsRepository)
  })

  it('should be able to sign up', async () => {
    const { org } = await sut.execute({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: '1234567',
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should bot be able to register with same email twice', async () => {
    await sut.execute({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: '1234567',
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    await expect(() =>
      sut.execute({
        title: 'Org 01',
        president: 'Gilson Ferreira',
        password: '1234567',
        email: 'teste@teste.com',
        whatsapp: '44998505620',
        adress: 'rua chile 19',
        cep: '87050120',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
