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

// src/use-cases/factories/make-edit-pet-use-case.ts
var make_edit_pet_use_case_exports = {};
__export(make_edit_pet_use_case_exports, {
  MakeEditPetUseCase: () => MakeEditPetUseCase
});
module.exports = __toCommonJS(make_edit_pet_use_case_exports);

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

// src/use-cases/errors/pet-not-found.ts
var PetNotFoundError = class extends Error {
  constructor() {
    super("Pet Not Found.");
  }
};

// src/use-cases/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid Credentials.");
  }
};

// src/use-cases/edit-pet.ts
var EditPetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    org_id,
    id,
    name,
    description,
    type,
    age,
    energy,
    size,
    independency,
    city
  }) {
    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new PetNotFoundError();
    }
    if (pet.org_id !== org_id) {
      throw new InvalidCredentialsError();
    }
    pet.name = name;
    pet.description = description;
    pet.type = type;
    pet.age = age;
    pet.energy = energy;
    pet.size = size;
    pet.independency = independency;
    pet.city = city;
    await this.petsRepository.save(pet);
    return {
      pet
    };
  }
};

// src/use-cases/factories/make-edit-pet-use-case.ts
function MakeEditPetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const editPetUseCase = new EditPetUseCase(petsRepository);
  return editPetUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MakeEditPetUseCase
});
