import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { EditOrgUseCase } from './edit-org'

let orgsRepository: InMemoryOrgsRepository
let sut: EditOrgUseCase

describe('Edit Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new EditOrgUseCase(orgsRepository)
  })

  it('should be able to edit a pet', async () => {
    const orgCreated = await orgsRepository.create({
      title: 'Org 01',
      president: 'Gilson Ferreira',
      password: '1234567',
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    const orgId = orgCreated.id

    const { org } = await sut.execute({
      id: orgId,
      title: 'Nova organização',
      president: 'Gilson Ferreira',
      password: '1234567',
      email: 'teste@teste.com',
      whatsapp: '44998505620',
      adress: 'rua chile 19',
      cep: '87050120',
    })

    expect(org.title).toEqual('Nova organização')
    expect(orgsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Nova organização',
      }),
    )
  })
})
