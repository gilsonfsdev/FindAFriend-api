import { Prisma, Pet } from '@prisma/client'

export interface petsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
