import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { MakeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['DOG', 'CAT']),
    age: z.enum(['PUPPY', 'ADULT', 'SENIOR']),
    energy: z.enum(['CALM', 'HECTIC']),
    size: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    independency: z.enum(['HIGH', 'LOW']),
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
  } = createPetBodySchema.parse(request.body)

  const createUseCase = MakeRegisterPetUseCase()

  const { pet } = await createUseCase.execute({
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    photo,
    orgId: request.user.sign.sub,
  })

  return reply.status(201).send({ pet })
}
