import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/middlewares/verify-jwt'

import { create } from './create'
import { profilePet } from './profile-pet'
import { searchPetsByFilters } from './search-pets-by-filters'
import { deletePet } from './delete-pet'
import { editPet } from './edit-pet'

export async function PetsRoutes(app: FastifyInstance) {
  /* Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)
  app.delete('/pets/delete/:id', { onRequest: [verifyJWT] }, deletePet)
  app.put('/pets/edit/:id', { onRequest: [verifyJWT] }, editPet)

  app.get('/pets/:id', profilePet)
  app.get('/pets/filters', searchPetsByFilters)
}
