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

// src/http/controllers/orgs/sign-up.ts
var sign_up_exports = {};
__export(sign_up_exports, {
  signUp: () => signUp
});
module.exports = __toCommonJS(sign_up_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  signUp
});
