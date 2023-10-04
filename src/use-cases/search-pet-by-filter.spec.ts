import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { SearchPetByFiltersUseCase } from './search-pet-by-filter'

let petsRepository: InMemoryPetsRepository
let sut: SearchPetByFiltersUseCase

describe('Search Pets By Filters Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new SearchPetByFiltersUseCase(petsRepository)
  })

  it('should be able to search pets by filters', async () => {
    await petsRepository.create({
      name: 'Teste 01',
      description: 'Teste description',
      type: 'CAT',
      age: 'PUPPY',
      energy: 'CALM',
      size: 'MEDIUM',
      independency: 'LOW',
      city: 'Maringa',
      photo: 'foto 1',
      org_id: 'org-1',
    })

    await petsRepository.create({
      name: 'Teste 02',
      description: 'Teste description',
      type: 'DOG',
      age: 'PUPPY',
      energy: 'CALM',
      size: 'MEDIUM',
      independency: 'LOW',
      city: 'Maringa',
      photo: 'foto 1',
      org_id: 'org-1',
    })

    const { pets } = await sut.execute({ city: 'Maringa', type: 'DOG' })

    expect(pets).toHaveLength(1)
  })
})
