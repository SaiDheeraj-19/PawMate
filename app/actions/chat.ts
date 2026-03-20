'use server'

import { getAuthenticatedOwner } from '@/lib/session'
import { messageSchema } from '@/lib/validations/schemas'
import prisma from '@/lib/prisma'

export async function getMatches() {
  const owner = await getAuthenticatedOwner()
  if (!owner) return []

  return await prisma.match.findMany({
    where: {
      OR: [
        { pet_a: { owner_id: owner.id } },
        { pet_b: { owner_id: owner.id } },
      ],
    },
    include: {
      pet_a: { include: { owner: { select: { name: true, avatar_url: true, id: true } } } },
      pet_b: { include: { owner: { select: { name: true, avatar_url: true, id: true } } } },
      messages: { orderBy: { created_at: 'desc' }, take: 20 },
    },
    orderBy: { created_at: 'desc' },
  })
}

export async function getMatch(matchId: string) {
  const owner = await getAuthenticatedOwner()
  if (!owner) return null

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      pet_a: { include: { owner: true } },
      pet_b: { include: { owner: true } },
      messages: { orderBy: { created_at: 'asc' } },
    },
  })

  // Security check: user must own one of the pets in the match
  if (!match || (match.pet_a.owner_id !== owner.id && match.pet_b.owner_id !== owner.id)) {
    return null
  }

  return match
}

export async function sendMessage(matchId: string, content: string) {
  const owner = await getAuthenticatedOwner()
  if (!owner) return { error: 'Unauthorized' }

  const validated = messageSchema.safeParse({ match_id: matchId, content })
  if (!validated.success) {
    return { error: 'Invalid message content' }
  }

  // Security check: match must exist and owner must be part of it
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { pet_a: true, pet_b: true },
  })

  if (!match || (match.pet_a.owner_id !== owner.id && match.pet_b.owner_id !== owner.id)) {
    return { error: 'Unauthorized access to match' }
  }

  try {
    const message = await prisma.message.create({
      data: {
        match_id: matchId,
        sender_owner_id: owner.id,
        content: validated.data.content,
      },
    })

    // Notify the other owner
    const receiverId = match.pet_a.owner_id === owner.id ? match.pet_b.owner_id : match.pet_a.owner_id
    await prisma.notification.create({
      data: {
        owner_id: receiverId,
        type: 'new_message',
        payload: { matchId: match.id, senderName: owner.name },
      },
    })

    return { success: true, message }
  } catch {
    return { error: 'Failed to send message' }
  }
}

export async function getMessages(matchId: string) {
  const owner = await getAuthenticatedOwner()
  if (!owner) return []

  // Security check: verify membership before returning messages
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { pet_a: true, pet_b: true },
  })

  if (!match || (match.pet_a.owner_id !== owner.id && match.pet_b.owner_id !== owner.id)) {
    return []
  }

  return await prisma.message.findMany({
    where: { match_id: matchId },
    orderBy: { created_at: 'asc' },
  })
}

export async function markAsRead(matchId: string) {
  const owner = await getAuthenticatedOwner()
  if (!owner) return

  await prisma.message.updateMany({
    where: {
      match_id: matchId,
      sender_owner_id: { not: owner.id },
      read_at: null,
    },
    data: {
      read_at: new Date(),
    },
  })
}
