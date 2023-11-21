import { MakeEditOrgUseCase } from '@/use-cases/factories/make-edit-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function editOrg(request: FastifyRequest, reply: FastifyReply) {
  const signupBodySchema = z.object({
    title: z.string().nonempty(),
    president: z.string().nonempty(),
    email: z.string().email().nonempty(),
    cep: z.string().nonempty(),
    adress: z.string().nonempty(),
    whatsapp: z.string().min(11).nonempty(),
    password: z.string().min(6).nonempty(),
  })

  const { title, president, email, cep, adress, password, whatsapp } =
    signupBodySchema.parse(request.body)

  const profileOrgParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = profileOrgParamsSchema.parse(request.params)

  const editOrgUseCase = MakeEditOrgUseCase()

  const { org } = await editOrgUseCase.execute({
    id,
    title,
    president,
    email,
    cep,
    adress,
    password,
    whatsapp,
  })

  return reply.status(200).send({ org })
}
