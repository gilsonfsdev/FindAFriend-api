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

// src/http/controllers/pets/routes.ts
var routes_exports = {};
__export(routes_exports, {
  PetsRoutes: () => PetsRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/http/controllers/pets/create.ts
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

// src/use-cases/errors/pet-not-found.ts
var PetNotFoundError = class extends Error {
  constructor() {
    super("Pet Not Found.");
  }
};

// src/use-cases/profile-pet.ts
var ProfilePetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    id
  }) {
    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new PetNotFoundError();
    }
    return { pet };
  }
};

// src/use-cases/factories/make-profile-pet-use-case.ts
function MakeProfilePetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const profilePetUseCase = new ProfilePetUseCase(petsRepository);
  return profilePetUseCase;
}

// src/http/controllers/pets/profile-pet.ts
var import_zod3 = require("zod");
async function profilePet(request, reply) {
  const profilePetParamsSchema = import_zod3.z.object({
    id: import_zod3.z.string()
  });
  const { id } = profilePetParamsSchema.parse(request.params);
  const profilPetUseCase = MakeProfilePetUseCase();
  const { pet } = await profilPetUseCase.execute({ id });
  return reply.status(200).send({ pet });
}

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
var import_zod4 = require("zod");
async function searchPetsByFilters(request, reply) {
  const searchPetsByFiltersQuerySchema = import_zod4.z.object({
    age: import_zod4.z.string().optional(),
    size: import_zod4.z.string().optional(),
    type: import_zod4.z.string().optional(),
    city: import_zod4.z.string().optional()
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

// src/use-cases/delete-pet.ts
var DeletePetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({ id }) {
    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new PetNotFoundError();
    }
    await this.petsRepository.delete(pet);
    return {};
  }
};

// src/use-cases/factories/make-delete-pet-use-case.ts
function MakeDeletePetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const deletePetUseCase = new DeletePetUseCase(petsRepository);
  return deletePetUseCase;
}

// src/http/controllers/pets/delete-pet.ts
var import_zod5 = require("zod");
async function deletePet(request, reply) {
  const deletePetParamsSchema = import_zod5.z.object({
    id: import_zod5.z.string()
  });
  const { id } = deletePetParamsSchema.parse(request.params);
  const deletePetUseCase = MakeDeletePetUseCase();
  await deletePetUseCase.execute({ id });
  return reply.status(204).send();
}

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

// src/http/controllers/pets/edit-pet.ts
var import_zod6 = require("zod");
async function editPet(request, reply) {
  const signupBodySchema = import_zod6.z.object({
    name: import_zod6.z.string(),
    description: import_zod6.z.string(),
    type: import_zod6.z.string(),
    age: import_zod6.z.string(),
    energy: import_zod6.z.string(),
    size: import_zod6.z.string(),
    independency: import_zod6.z.string(),
    city: import_zod6.z.string()
  });
  const { name, description, type, age, energy, size, independency, city } = signupBodySchema.parse(request.body);
  const profilePetParamsSchema = import_zod6.z.object({
    id: import_zod6.z.string()
  });
  const org_id = request.user.sign.sub;
  const { id } = profilePetParamsSchema.parse(request.params);
  const editPetUseCase = MakeEditPetUseCase();
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
    city
  });
  return reply.status(200).send({ pet });
}

// src/http/controllers/pets/routes.ts
async function PetsRoutes(app) {
  app.post("/pets", { onRequest: [verifyJWT] }, create);
  app.delete("/pets/delete/:id", { onRequest: [verifyJWT] }, deletePet);
  app.put("/pets/edit/:id", { onRequest: [verifyJWT] }, editPet);
  app.get("/pets/:id", profilePet);
  app.get("/pets/filters", searchPetsByFilters);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PetsRoutes
});
