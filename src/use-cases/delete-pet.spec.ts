import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { DeletePetUseCase } from './delete-pet'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: DeletePetUseCase

describe('Delete Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new DeletePetUseCase(petsRepository)
  })

  it('should be able to Delete a pet', async () => {
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

    const createdPet = await petsRepository.create({
      name: 'Teste 01',
      description: 'Teste description',
      type: 'CAT',
      age: 'PUPPY',
      energy: 'CALM',
      size: 'MEDIUM',
      independency: 'LOW',
      city: 'Cabedelo',
      photo: 'foto 1',
      org_id: orgId,
    })

    await sut.execute({
      id: createdPet.id,
    })

    expect(petsRepository.items).toHaveLength(0)
  })
})
