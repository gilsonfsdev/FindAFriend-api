import { FastifyInstance } from 'fastify'
import { signUp } from './sign-up'
import { authenticate } from './authenticate'
import { profileOrg } from './profile-org'
import { verifyJWT } from '@/middlewares/verify-jwt'
import { editOrg } from './edit-org'

export async function OrgRoutes(app: FastifyInstance) {
  app.post('/signup', signUp)
  app.post('/signin', authenticate)
  app.get('/org/:id', profileOrg)

  app.put('/org/edit/:id', { onRequest: [verifyJWT] }, editOrg)
}
