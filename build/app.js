"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/http/controllers/orgs/sign-up.ts
var import_zod2 = require("zod");

// src/use-cases/errors/org-already-exists.ts
var OrgAlreadyExistsError = class extends Error {
  constructor() {
    super("Organization already exists.");
  }
};

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

// src/repositories/prisma/prisma-orgs-repository.ts
var PrismaOrgsRepository = class {
  async save(org) {
    const updatedOrg = await prisma.org.update({
      where: {
        id: org.id
      },
      data: org
    });
    return updatedOrg;
  }
  async findById(id) {
    const org = await prisma.org.findUnique({
      where: {
        id
      }
    });
    return org;
  }
  async create(data) {
    const org = await prisma.org.create({
      data
    });
    return org;
  }
  async findByEmail(email) {
    const org = await prisma.org.findUnique({
      where: {
        email
      }
    });
    return org;
  }
};

// src/use-cases/sign-up.ts
var import_bcryptjs = require("bcryptjs");
var SignUpUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    title,
    president,
    password,
    email,
    whatsapp,
    adress,
    cep
  }) {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email);
    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError();
    }
    const passwordHash = await (0, import_bcryptjs.hash)(password, 6);
    const org = await this.orgsRepository.create({
      title,
      president,
      email,
      cep,
      adress,
      password: passwordHash,
      whatsapp
    });
    return { org };
  }
};

// src/use-cases/factories/make-sign-up-use-case.ts
function MakeSignUpUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const signUpUseCase = new SignUpUseCase(orgsRepository);
  return signUpUseCase;
}

// src/http/controllers/orgs/sign-up.ts
async function signUp(request, reply) {
  const signupBodySchema = import_zod2.z.object({
    title: import_zod2.z.string().nonempty(),
    president: import_zod2.z.string().nonempty(),
    email: import_zod2.z.string().email().nonempty(),
    cep: import_zod2.z.string().nonempty(),
    adress: import_zod2.z.string().nonempty(),
    whatsapp: import_zod2.z.string().min(11).nonempty(),
    password: import_zod2.z.string().min(6).nonempty()
  });
  const { title, president, email, cep, adress, password, whatsapp } = signupBodySchema.parse(request.body);
  try {
    const signUpUseCase = MakeSignUpUseCase();
    await signUpUseCase.execute({
      title,
      president,
      email,
      cep,
      adress,
      password,
      whatsapp
    });
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(201).send();
}

// src/http/controllers/orgs/authenticate.ts
var import_zod3 = require("zod");

// src/use-cases/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid Credentials.");
  }
};

// src/use-cases/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
var AuthenticateUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    password,
    email
  }) {
    const org = await this.orgsRepository.findByEmail(email);
    if (!org) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatches = await (0, import_bcryptjs2.compare)(password, org.password);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return { org };
  }
};

// src/use-cases/factories/make-authenticate-use-case.ts
function MakeAuthenticateUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const authenticateUseCase = new AuthenticateUseCase(orgsRepository);
  return authenticateUseCase;
}

// src/http/controllers/orgs/authenticate.ts
async function authenticate(request, reply) {
  const authenticateBodySchema = import_zod3.z.object({
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string().min(6)
  });
  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = MakeAuthenticateUseCase();
    const { org } = await authenticateUseCase.execute({
      email,
      password
    });
    const token = await reply.jwtSign({
      sign: { sub: org.id }
    });
    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}

// src/use-cases/errors/org-not-found.ts
var OrgNotFoundError = class extends Error {
  constructor() {
    super("Org Not Found.");
  }
};

// src/use-cases/profile-org.ts
var ProfileOrgUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    id
  }) {
    const org = await this.orgsRepository.findById(id);
    if (!org) {
      throw new OrgNotFoundError();
    }
    return { org };
  }
};

// src/use-cases/factories/make-profile-org-use-case.ts
function MakeProfileOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const profileOrgsUseCase = new ProfileOrgUseCase(orgsRepository);
  return profileOrgsUseCase;
}

// src/http/controllers/orgs/profile-org.ts
var import_zod4 = require("zod");
async function profileOrg(request, reply) {
  const profileOrgParamsSchema = import_zod4.z.object({
    id: import_zod4.z.string()
  });
  const { id } = profileOrgParamsSchema.parse(request.params);
  const profilOrgUseCase = MakeProfileOrgsUseCase();
  const { org } = await profilOrgUseCase.execute({ id });
  return reply.status(200).send({ org });
}

// src/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/use-cases/edit-org.ts
var EditOrgUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    id,
    president,
    title,
    adress,
    email,
    cep,
    whatsapp,
    password
  }) {
    const org = await this.orgsRepository.findById(id);
    if (!org) {
      throw new OrgNotFoundError();
    }
    org.president = president;
    org.title = title;
    org.adress = adress;
    org.email = email;
    org.cep = cep;
    org.whatsapp = whatsapp;
    org.password = password;
    await this.orgsRepository.save(org);
    return {
      org
    };
  }
};

// src/use-cases/factories/make-edit-org-use-case.ts
function MakeEditOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const editOrgUseCase = new EditOrgUseCase(orgsRepository);
  return editOrgUseCase;
}

// src/http/controllers/orgs/edit-org.ts
var import_zod5 = require("zod");
async function editOrg(request, reply) {
  const signupBodySchema = import_zod5.z.object({
    title: import_zod5.z.string().nonempty(),
    president: import_zod5.z.string().nonempty(),
    email: import_zod5.z.string().email().nonempty(),
    cep: import_zod5.z.string().nonempty(),
    adress: import_zod5.z.string().nonempty(),
    whatsapp: import_zod5.z.string().min(11).nonempty(),
    password: import_zod5.z.string().min(6).nonempty()
  });
  const { title, president, email, cep, adress, password, whatsapp } = signupBodySchema.parse(request.body);
  const profileOrgParamsSchema = import_zod5.z.object({
    id: import_zod5.z.string()
  });
  const { id } = profileOrgParamsSchema.parse(request.params);
  const editOrgUseCase = MakeEditOrgUseCase();
  const { org } = await editOrgUseCase.execute({
    id,
    title,
    president,
    email,
    cep,
    adress,
    password,
    whatsapp
  });
  return reply.status(200).send({ org });
}

// src/http/controllers/orgs/routes.ts
async function OrgRoutes(app2) {
  app2.post("/signup", signUp);
  app2.post("/signin", authenticate);
  app2.get("/org/:id", profileOrg);
  app2.put("/org/edit/:id", { onRequest: [verifyJWT] }, editOrg);
}

// src/app.ts
var import_zod11 = require("zod");

// src/http/controllers/pets/create.ts
var import_zod6 = require("zod");

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
  const createPetBodySchema = import_zod6.z.object({
    name: import_zod6.z.string(),
    description: import_zod6.z.string(),
    type: import_zod6.z.enum(["DOG", "CAT"]),
    age: import_zod6.z.enum(["PUPPY", "ADULT", "SENIOR"]),
    energy: import_zod6.z.enum(["CALM", "HECTIC"]),
    size: import_zod6.z.enum(["SMALL", "MEDIUM", "BIG"]),
    independency: import_zod6.z.enum(["HIGH", "LOW"]),
    city: import_zod6.z.string()
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
var import_zod7 = require("zod");
async function profilePet(request, reply) {
  const profilePetParamsSchema = import_zod7.z.object({
    id: import_zod7.z.string()
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
var import_zod8 = require("zod");
async function searchPetsByFilters(request, reply) {
  const searchPetsByFiltersQuerySchema = import_zod8.z.object({
    age: import_zod8.z.string().optional(),
    size: import_zod8.z.string().optional(),
    type: import_zod8.z.string().optional(),
    city: import_zod8.z.string().optional()
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
var import_zod9 = require("zod");
async function deletePet(request, reply) {
  const deletePetParamsSchema = import_zod9.z.object({
    id: import_zod9.z.string()
  });
  const { id } = deletePetParamsSchema.parse(request.params);
  const deletePetUseCase = MakeDeletePetUseCase();
  await deletePetUseCase.execute({ id });
  return reply.status(204).send();
}

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
var import_zod10 = require("zod");
async function editPet(request, reply) {
  const signupBodySchema = import_zod10.z.object({
    name: import_zod10.z.string(),
    description: import_zod10.z.string(),
    type: import_zod10.z.string(),
    age: import_zod10.z.string(),
    energy: import_zod10.z.string(),
    size: import_zod10.z.string(),
    independency: import_zod10.z.string(),
    city: import_zod10.z.string()
  });
  const { name, description, type, age, energy, size, independency, city } = signupBodySchema.parse(request.body);
  const profilePetParamsSchema = import_zod10.z.object({
    id: import_zod10.z.string()
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
async function PetsRoutes(app2) {
  app2.post("/pets", { onRequest: [verifyJWT] }, create);
  app2.delete("/pets/delete/:id", { onRequest: [verifyJWT] }, deletePet);
  app2.put("/pets/edit/:id", { onRequest: [verifyJWT] }, editPet);
  app2.get("/pets/:id", profilePet);
  app2.get("/pets/filters", searchPetsByFilters);
}

// src/app.ts
var import_jwt = __toESM(require("@fastify/jwt"));
var app = (0, import_fastify.default)();
app.register(import_jwt.default, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10m"
  }
});
app.register(OrgRoutes);
app.register(PetsRoutes);
app.setErrorHandler((error, request, reply) => {
  if (error instanceof import_zod11.ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
  }
  return reply.status(500).send({ message: "Internal Server Error." });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
