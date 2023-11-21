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

// src/repositories/in-memory/in-memory-pets-repository.ts
var in_memory_pets_repository_exports = {};
__export(in_memory_pets_repository_exports, {
  InMemoryPetsRepository: () => InMemoryPetsRepository
});
module.exports = __toCommonJS(in_memory_pets_repository_exports);
var import_crypto = require("crypto");
var InMemoryPetsRepository = class {
  constructor() {
    this.items = [];
  }
  async delete(pet) {
    const itemIndex = this.items.findIndex((item) => item.id === pet.id);
    this.items.splice(itemIndex, 1);
  }
  async save(pet) {
    const itemIndex = this.items.findIndex((item) => item.id === pet.id);
    this.items[itemIndex] = pet;
    return this.items[itemIndex];
  }
  async findManyByFilters(data) {
    const pets = this.items.filter((item) => {
      for (const key in data) {
        if (item[key] !== data[key]) {
          return false;
        }
      }
      return true;
    });
    return pets;
  }
  async findById(id) {
    const pet = this.items.find((item) => item.id === id);
    if (!pet) {
      return null;
    }
    return pet;
  }
  async create(data) {
    const pet = {
      id: (0, import_crypto.randomUUID)(),
      name: data.name,
      description: data.description,
      type: data.type,
      age: data.age,
      energy: data.energy,
      size: data.size,
      independency: data.independency,
      city: data.city,
      photo: data.photo,
      org_id: data.org_id
    };
    this.items.push(pet);
    return pet;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryPetsRepository
});
