import { randomUUID } from 'crypto'
import { orgsRepository } from '../orgs-repository'
import { Org, Prisma } from '@prisma/client'

export class InMemoryOrgsRepository implements orgsRepository {
  public items: Org[] = []

  async save(org: Org) {
    const itemIndex = this.items.findIndex((item) => item.id === org.id)

    this.items[itemIndex] = org

    return this.items[itemIndex]
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: randomUUID(),
      title: data.title,
      president: data.president,
      adress: data.adress,
      cep: data.cep,
      email: data.email,
      whatsapp: data.whatsapp,
      password: data.password,
    }

    this.items.push(org)

    return org
  }
}
