import { beforeEach, describe, expect, it } from 'vitest'
import { ProfileOrgUseCase } from './profile-org'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

let orgsRepository: InMemoryOrgsRepository
let sut: ProfileOrgUseCase

describe('Profile Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new ProfileOrgUseCase(orgsRepository)
  })

  it('should be able to get a org profile', async () => {
    const createdOrg = await orgsRepository.create({
      title: 'Org 1',
      president: 'Gilson',
      adress: 'Rua teste 01',
      cep: '87050120',
      email: 'teste@teste.com',
      password: 'teste01',
      whatsapp: '44998505620',
    })

    const { org } = await sut.execute({ id: createdOrg.id })

    expect(org.president).toEqual('Gilson')
    expect(orgsRepository.items[0]).toEqual(
      expect.objectContaining({
        president: 'Gilson',
      }),
    )
  })
})
