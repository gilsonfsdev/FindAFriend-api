import { MakeEditPetUseCase } from '@/use-cases/factories/make-edit-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function editPet(request: FastifyRequest, reply: FastifyReply) {
  const signupBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    age: z.string(),
    energy: z.string(),
    size: z.string(),
    independency: z.string(),
    city: z.string(),
    photo: z.string(),
  })

  const {
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    photo,
  } = signupBodySchema.parse(request.body)

  const profilePetParamsSchema = z.object({
    id: z.string(),
  })

  const org_id = request.user.sign.sub

  const { id } = profilePetParamsSchema.parse(request.params)

  const editPetUseCase = MakeEditPetUseCase()

  const { pet } = await editPetUseCase.execute({
    org_id,
    id,
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    photo,
  })

  return reply.status(200).send({ pet })
}
