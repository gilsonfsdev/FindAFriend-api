import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { ProfilePetUseCase } from './profile-pet'

let petsRepository: InMemoryPetsRepository
let sut: ProfilePetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new ProfilePetUseCase(petsRepository)
  })

  it('should be able to get a pet profile', async () => {
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
      org_id: 'org-1',
    })

    const { pet } = await sut.execute({ id: createdPet.id })

    expect(pet.name).toEqual('Teste 01')
  })
})
