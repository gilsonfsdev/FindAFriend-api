import { MakeGetPetByCityUseCase } from '@/use-cases/factories/make-get-pet-by-city'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getPetByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getPetByCityQuerySchema = z.object({
    city: z.string(),
  })

  const { city } = getPetByCityQuerySchema.parse(request.query)

  const getPetByCityPetUseCase = MakeGetPetByCityUseCase()

  const { pets } = await getPetByCityPetUseCase.execute({ city })

  return reply.status(200).send({ pets })
}
