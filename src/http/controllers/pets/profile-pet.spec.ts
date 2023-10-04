import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet profile', async () => {
    await request(app.server).post('/signup').send({
      title: 'Org 1',
      president: 'Gilson Test',
      email: 'teste01@gmail.com',
      cep: '87050120',
      adress: 'rua rio cunha 17',
      whatsapp: '44998505620',
      password: '1234567',
    })

    const authenticateOrg = await request(app.server).post('/signin').send({
      email: 'teste01@gmail.com',
      password: '1234567',
    })

    const { token } = authenticateOrg.body

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cachorro teste',
        description: 'Descrição teste',
        type: 'DOG',
        age: 'ADULT',
        energy: 'CALM',
        size: 'BIG',
        independency: 'LOW',
        city: 'Maringa',
        photo: 'photo1.jpg',
      })

    const pet = await prisma.pet.findFirstOrThrow()
    const petId = pet.id

    const response = await request(app.server).get(`/pets/${petId}`)

    expect(response.statusCode).toEqual(200)
  })
})
