import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/middlewares/verify-jwt'

import { create } from './create'
import { profilePet } from './profile-pet'
import { searchPetsByFilters } from './search-pets-by-filters'

export async function PetsRoutes(app: FastifyInstance) {
  /* Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)

  app.get('/pets/:id', profilePet)
  app.get('/pets/filters', searchPetsByFilters)
}
