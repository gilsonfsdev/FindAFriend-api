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

// src/use-cases/edit-pet.ts
var edit_pet_exports = {};
__export(edit_pet_exports, {
  EditPetUseCase: () => EditPetUseCase
});
module.exports = __toCommonJS(edit_pet_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditPetUseCase
});
