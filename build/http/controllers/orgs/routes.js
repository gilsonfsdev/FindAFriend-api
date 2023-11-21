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

// src/http/controllers/orgs/routes.ts
var routes_exports = {};
__export(routes_exports, {
  OrgRoutes: () => OrgRoutes
});
module.exports = __toCommonJS(routes_exports);

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
async function OrgRoutes(app) {
  app.post("/signup", signUp);
  app.post("/signin", authenticate);
  app.get("/org/:id", profileOrg);
  app.put("/org/edit/:id", { onRequest: [verifyJWT] }, editOrg);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OrgRoutes
});
