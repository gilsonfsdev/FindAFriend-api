import { FastifyInstance } from 'fastify'
import { signUp } from './sign-up'
import { authenticate } from './authenticate'

export async function OrgRoutes(app: FastifyInstance) {
  app.post('/signup', signUp)
  app.post('/signin', authenticate)
}
