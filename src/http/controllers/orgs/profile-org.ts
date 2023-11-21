import { MakeProfileOrgsUseCase } from '@/use-cases/factories/make-profile-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profileOrg(request: FastifyRequest, reply: FastifyReply) {
  const profileOrgParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = profileOrgParamsSchema.parse(request.params)

  const profilOrgUseCase = MakeProfileOrgsUseCase()

  const { org } = await profilOrgUseCase.execute({ id })

  return reply.status(200).send({ org })
}
