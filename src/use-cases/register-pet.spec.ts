import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { RegisterPetUseCase } from './register-pet'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new RegisterPetUseCase(petsRepository)
  })

  it('should be able to register a pet', async () => {
    const org = await orgsRepository.create({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: '1234567',
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    const orgId = org.id

    const { pet } = await sut.execute({
      name: 'Teste 01',
      description: 'Teste description',
      type: 'CAT',
      age: 'PUPPY',
      energy: 'CALM',
      size: 'MEDIUM',
      independency: 'LOW',
      city: 'Cabedelo',
      photo: 'foto 1',
      orgId,
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
