import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Sign Up (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to sign up', async () => {
    const response = await request(app.server).post('/signup').send({
      title: 'Org 1',
      president: 'Gilson Test',
      email: 'teste01@gmail.com',
      cep: '87050120',
      adress: 'rua rio cunha 17',
      whatsapp: '44998505620',
      password: '1234567',
    })

    expect(response.statusCode).toEqual(201)
  })
})
