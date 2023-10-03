import { MakeProfilePetUseCase } from '@/use-cases/factories/make-profile-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profilePet(request: FastifyRequest, reply: FastifyReply) {
  const profilePetParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = profilePetParamsSchema.parse(request.params)

  const profilPetUseCase = MakeProfilePetUseCase()

  const { pet } = await profilPetUseCase.execute({ id })

  return reply.status(200).send({ pet })
}
