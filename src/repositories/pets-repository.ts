import { Prisma, Pet } from '@prisma/client'

export interface petsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findManyByFilters(data: Partial<Prisma.PetCreateManyOrgInput>): Promise<Pet[]>
}
