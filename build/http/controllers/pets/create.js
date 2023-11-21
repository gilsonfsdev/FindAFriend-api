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

// src/http/controllers/pets/create.ts
var create_exports = {};
__export(create_exports, {
  create: () => create
});
module.exports = __toCommonJS(create_exports);
var import_zod2 = require("zod");

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

// src/use-cases/register-pet.ts
var RegisterPetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    orgId
  }) {
    const pet = await this.petsRepository.create({
      name,
      description,
      type,
      age,
      energy,
      size,
      independency,
      city,
      org_id: orgId
    });
    return { pet };
  }
};

// src/use-cases/factories/make-register-pet-use-case.ts
function MakeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const registerPetUseCase = new RegisterPetUseCase(petsRepository);
  return registerPetUseCase;
}

// src/http/controllers/pets/create.ts
async function create(request, reply) {
  const createPetBodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    description: import_zod2.z.string(),
    type: import_zod2.z.enum(["DOG", "CAT"]),
    age: import_zod2.z.enum(["PUPPY", "ADULT", "SENIOR"]),
    energy: import_zod2.z.enum(["CALM", "HECTIC"]),
    size: import_zod2.z.enum(["SMALL", "MEDIUM", "BIG"]),
    independency: import_zod2.z.enum(["HIGH", "LOW"]),
    city: import_zod2.z.string()
  });
  const { name, description, type, age, energy, size, independency, city } = createPetBodySchema.parse(request.body);
  const createUseCase = MakeRegisterPetUseCase();
  const { pet } = await createUseCase.execute({
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city,
    orgId: request.user.sign.sub
  });
  return reply.status(201).send({ pet });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create
});
