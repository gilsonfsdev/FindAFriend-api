import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Profile Org(e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a org profile', async () => {
    await request(app.server).post('/signup').send({
      title: 'Org 1',
      president: 'Gilson Test',
      email: 'teste01@gmail.com',
      cep: '87050120',
      adress: 'rua rio cunha 17',
      whatsapp: '44998505620',
      password: '1234567',
    })

    const org = await prisma.org.findFirstOrThrow()
    const orgId = org.id

    const response = await request(app.server).get(`/org/${orgId}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.org.title).toEqual('Org 1')
  })
})
