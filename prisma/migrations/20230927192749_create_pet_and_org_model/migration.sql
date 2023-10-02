-- CreateEnum
CREATE TYPE "TypePet" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "AgePet" AS ENUM ('PUPPY', 'ADULT', 'OLD');

-- CreateEnum
CREATE TYPE "EnergyPet" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('LITTLE', 'MEDIUM', 'BIG');

-- CreateEnum
CREATE TYPE "PetIndependency" AS ENUM ('LOWER', 'MEDIUM', 'HIGHER');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypePet" NOT NULL,
    "age" "AgePet" NOT NULL,
    "energy" "EnergyPet" NOT NULL,
    "size" "PetSize" NOT NULL,
    "independency" "PetIndependency" NOT NULL,
    "city" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orgs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "president" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "orgs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orgs_email_key" ON "orgs"("email");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
