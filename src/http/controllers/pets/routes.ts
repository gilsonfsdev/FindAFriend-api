import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/middlewares/verify-jwt'

export async function PetsRoutes(app: FastifyInstance) {
  /* Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
