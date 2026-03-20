'use server'

import { getAuthenticatedOwner } from '@/lib/session'
import { swipeSchema } from '@/lib/validations/schemas'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function getPetsToDiscover(
  myPetId: string,
  filters: {
    species?: string
    breed?: string
    intent?: string
    minAge?: number
    maxAge?: number
  }
) {
  const owner = await getAuthenticatedOwner()

  // Ensure the pet belongs to the authenticated owner
  const myPet = await prisma.pet.findFirst({
    where: { id: myPetId, owner_id: owner.id }
  })
  if (!myPet) return []

  const swipedPetIds = await prisma.swipe.findMany({
    where: { swiper_pet_id: myPetId },
    select: { swiped_pet_id: true },
  }).then(swipes => swipes.map(s => s.swiped_pet_id))

  // Base filters
  const where: Prisma.PetWhereInput = {
    owner_id: { not: owner.id },
    id: { notIn: swipedPetIds },
    age_months: { gte: filters.minAge || 0, lte: filters.maxAge || 240 },
  }

  if (filters.species && filters.species !== 'all') {
    where.species = filters.species as Prisma.StringFilter
  }
  if (filters.intent && filters.intent !== 'all') {
    where.OR = [{ intent: filters.intent as Prisma.StringFilter }, { intent: 'both' }]
  }

  // If owner has location, sort by distance using PostGIS
  if (owner.lat && owner.lng) {
    return await prisma.$queryRaw<Prisma.PetMaxAggregateOutputType[]>`
      SELECT p.*, o.name as owner_name, o.city as city, o.avatar_url as owner_avatar,
             ST_Distance(o.location, ST_SetSRID(ST_MakePoint(${owner.lng}, ${owner.lat}), 4326)::geography) as distance
      FROM pets p
      JOIN owners o ON p.owner_id = o.id
      WHERE p.owner_id != ${owner.id}
        AND p.id NOT IN (${swipedPetIds.length > 0 ? swipedPetIds : ['00000000-0000-0000-0000-000000000000']})
        AND (${filters.species || 'all'} = 'all' OR p.species::text = ${filters.species})
        AND (${filters.intent || 'all'} = 'all' OR p.intent::text = ${filters.intent} OR p.intent::text = 'both')
        AND p.age_months >= ${filters.minAge || 0}
        AND p.age_months <= ${filters.maxAge || 240}
      ORDER BY distance ASC
      LIMIT 20
    `
  }

  return await prisma.pet.findMany({
    where,
    include: { owner: { select: { name: true, city: true, avatar_url: true } } },
    take: 20,
  })
}

export async function swipe(swiperPetId: string, swipedPetId: string, direction: string) {
  const owner = await getAuthenticatedOwner()

  const validated = swipeSchema.safeParse({ swiper_pet_id: swiperPetId, swiped_pet_id: swipedPetId, direction })
  if (!validated.success) {
    return { error: 'Invalid swipe payload' }
  }

  // Ensure the swiper pet belongs to the owner
  const myPet = await prisma.pet.findFirst({
    where: { id: swiperPetId, owner_id: owner.id }
  })
  if (!myPet) return { error: 'Unauthorized pet swipe' }

  // Prevent swiping own pets
  const targetPet = await prisma.pet.findUnique({ where: { id: swipedPetId } })
  if (!targetPet || targetPet.owner_id === owner.id) {
    return { error: 'Cannot swipe own pet' }
  }

  try {
    await prisma.swipe.create({
      data: {
        swiper_pet_id: swiperPetId,
        swiped_pet_id: swipedPetId,
        direction: direction as 'like' | 'pass',
      },
    })

    if (direction === 'like') {
      const mutualSwipe = await prisma.swipe.findFirst({
        where: {
          swiper_pet_id: swipedPetId,
          swiped_pet_id: swiperPetId,
          direction: 'like',
        },
      })

      if (mutualSwipe) {
        const match = await prisma.match.create({
          data: {
            pet_a_id: swiperPetId,
            pet_b_id: swipedPetId,
          },
        })

        // Notifications
        await prisma.notification.createMany({
          data: [
            { owner_id: owner.id, type: 'new_match', payload: { matchId: match.id, petName: targetPet.name } as Prisma.InputJsonValue },
            { owner_id: targetPet.owner_id, type: 'new_match', payload: { matchId: match.id, petName: myPet.name } as Prisma.InputJsonValue },
          ],
        })

        return { success: "It's a match!", matchId: match.id }
      }
    }

    return { success: true }
  } catch {
    return { error: 'Failed to record swipe' }
  }
}
