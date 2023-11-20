import { MakeSearchPetByFiltersUseCase } from '@/use-cases/factories/make-search-pets-by-filter'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchPetsByFilters(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchPetsByFiltersQuerySchema = z.object({
    age: z.string().optional(),
    size: z.string().optional(),
    type: z.string().optional(),
    city: z.string().optional(),
  })

  const { age, size, type, city } = searchPetsByFiltersQuerySchema.parse(
    request.query,
  )

  const searchPetsByFiltersPetUseCase = MakeSearchPetByFiltersUseCase()

  const { pets } = await searchPetsByFiltersPetUseCase.execute({
    age,
    size,
    type,
    city,
  })

  return reply.status(200).send({ pets })
}
