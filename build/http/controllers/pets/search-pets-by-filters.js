"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/pets/search-pets-by-filters.ts
var search_pets_by_filters_exports = {};
__export(search_pets_by_filters_exports, {
  searchPetsByFilters: () => searchPetsByFilters
});
module.exports = __toCommonJS(search_pets_by_filters_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/prisma.ts
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/pisma-pet-repository.ts
var PrismaPetsRepository = class {
  async delete(pet) {
    await prisma.pet.delete({
      where: {
        id: pet.id
      }
    });
  }
  async save(pet) {
    const updatedPet = await prisma.pet.update({
      where: {
        id: pet.id
      },
      data: pet
    });
    return updatedPet;
  }
  async findManyByFilters(data) {
    const pets = await prisma.pet.findMany({
      where: data
    });
    return pets;
  }
  async findById(id) {
    const pet = await prisma.pet.findUnique({
      where: {
        id
      }
    });
    return pet;
  }
  async create(data) {
    const pet = await prisma.pet.create({
      data
    });
    return pet;
  }
};

// src/use-cases/search-pet-by-filter.ts
var SearchPetByFiltersUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute(data) {
    const pets = await this.petsRepository.findManyByFilters(data);
    return { pets };
  }
};

// src/use-cases/factories/make-search-pets-by-filter.ts
function MakeSearchPetByFiltersUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const searchPetByFiltersUseCase = new SearchPetByFiltersUseCase(
    petsRepository
  );
  return searchPetByFiltersUseCase;
}

// src/http/controllers/pets/search-pets-by-filters.ts
var import_zod2 = require("zod");
async function searchPetsByFilters(request, reply) {
  const searchPetsByFiltersQuerySchema = import_zod2.z.object({
    age: import_zod2.z.string().optional(),
    size: import_zod2.z.string().optional(),
    type: import_zod2.z.string().optional(),
    city: import_zod2.z.string().optional()
  });
  const { age, size, type, city } = searchPetsByFiltersQuerySchema.parse(
    request.query
  );
  const searchPetsByFiltersPetUseCase = MakeSearchPetByFiltersUseCase();
  const { pets } = await searchPetsByFiltersPetUseCase.execute({
    age,
    size,
    type,
    city
  });
  return reply.status(200).send({ pets });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchPetsByFilters
});
