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

// src/use-cases/edit-org.ts
var edit_org_exports = {};
__export(edit_org_exports, {
  EditOrgUseCase: () => EditOrgUseCase
});
module.exports = __toCommonJS(edit_org_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditOrgUseCase
});
