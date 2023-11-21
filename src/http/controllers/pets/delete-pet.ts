import { MakeDeletePetUseCase } from '@/use-cases/factories/make-delete-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePet(request: FastifyRequest, reply: FastifyReply) {
  const deletePetParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deletePetParamsSchema.parse(request.params)

  const deletePetUseCase = MakeDeletePetUseCase()

  await deletePetUseCase.execute({ id })

  return reply.status(204).send()
}
