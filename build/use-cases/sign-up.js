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

// src/use-cases/sign-up.ts
var sign_up_exports = {};
__export(sign_up_exports, {
  SignUpUseCase: () => SignUpUseCase
});
module.exports = __toCommonJS(sign_up_exports);
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/org-already-exists.ts
var OrgAlreadyExistsError = class extends Error {
  constructor() {
    super("Organization already exists.");
  }
};

// src/use-cases/sign-up.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SignUpUseCase
});
