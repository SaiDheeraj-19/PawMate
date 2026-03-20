-- CreateEnum
CREATE TYPE "Species" AS ENUM ('dog', 'cat', 'rabbit', 'bird', 'other');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('small', 'medium', 'large');

-- CreateEnum
CREATE TYPE "Intent" AS ENUM ('playdate', 'breeding', 'both');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('like', 'pass');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('new_match', 'new_message');

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatar_url" TEXT,
    "city" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "breed" TEXT,
    "age_months" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "size" "Size" NOT NULL,
    "temperament_tags" TEXT[],
    "description" TEXT,
    "intent" "Intent" NOT NULL,
    "is_vaccinated" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swipes" (
    "id" TEXT NOT NULL,
    "swiper_pet_id" TEXT NOT NULL,
    "swiped_pet_id" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "pet_a_id" TEXT NOT NULL,
    "pet_b_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "sender_owner_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_auth_user_id_key" ON "owners"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "swipes_swiper_pet_id_swiped_pet_id_key" ON "swipes"("swiper_pet_id", "swiped_pet_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_pet_a_id_pet_b_id_key" ON "matches"("pet_a_id", "pet_b_id");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipes" ADD CONSTRAINT "swipes_swiper_pet_id_fkey" FOREIGN KEY ("swiper_pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipes" ADD CONSTRAINT "swipes_swiped_pet_id_fkey" FOREIGN KEY ("swiped_pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_pet_a_id_fkey" FOREIGN KEY ("pet_a_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_pet_b_id_fkey" FOREIGN KEY ("pet_b_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_owner_id_fkey" FOREIGN KEY ("sender_owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
