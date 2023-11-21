import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Edit Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a org', async () => {
    await request(app.server).post('/signup').send({
      title: 'Org 1',
      president: 'Gilson Test',
      email: 'teste01@gmail.com',
      cep: '87050120',
      adress: 'rua rio cunha 17',
      whatsapp: '44998505620',
      password: '1234567',
    })

    const authenticate = await request(app.server).post('/signin').send({
      email: 'teste01@gmail.com',
      password: '1234567',
    })

    const token = authenticate.body.token

    const org = await prisma.org.findFirstOrThrow()
    const orgId = org.id

    const response = await request(app.server)
      .put(`/org/edit/${orgId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Org 1',
        president: 'Novo presidente',
        email: 'teste01@gmail.com',
        cep: '87050120',
        adress: 'rua rio cunha 17',
        whatsapp: '44998505620',
        password: '1234567',
      })

    expect(response.statusCode).toEqual(200)

    const orgInspect = await prisma.org.findFirstOrThrow({
      where: {
        id: orgId,
      },
    })

    expect(orgInspect.president).toEqual('Novo presidente')
  })
})
