import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { OrgAlreadyExistsError } from '../../../use-cases/errors/org-already-exists'
import { MakeSignUpUseCase } from '@/use-cases/factories/make-sign-up-use-case'

export async function signUp(request: FastifyRequest, reply: FastifyReply) {
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

  try {
    const signUpUseCase = MakeSignUpUseCase()

    await signUpUseCase.execute({
      title,
      president,
      email,
      cep,
      adress,
      password,
      whatsapp,
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
  return reply.status(201).send()
}
