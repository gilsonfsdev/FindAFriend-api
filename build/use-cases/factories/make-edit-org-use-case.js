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

// src/use-cases/factories/make-edit-org-use-case.ts
var make_edit_org_use_case_exports = {};
__export(make_edit_org_use_case_exports, {
  MakeEditOrgUseCase: () => MakeEditOrgUseCase
});
module.exports = __toCommonJS(make_edit_org_use_case_exports);

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

// src/use-cases/errors/org-not-found.ts
var OrgNotFoundError = class extends Error {
  constructor() {
    super("Org Not Found.");
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MakeEditOrgUseCase
});
