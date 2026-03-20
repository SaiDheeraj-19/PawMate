'use server'

import { getAuthenticatedOwner } from '@/lib/session'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const owner = await getAuthenticatedOwner()

  return await prisma.notification.findMany({
    where: { owner_id: owner.id },
    orderBy: { created_at: 'desc' },
    take: 20,
  })
}

export async function markNotificationAsRead(id: string) {
  const owner = await getAuthenticatedOwner()

  try {
    await prisma.notification.update({
      where: { id, owner_id: owner.id },
      data: { read: true },
    })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch {
    return { error: 'Failed to update notification' }
  }
}

export async function getUnreadCount() {
  const owner = await getAuthenticatedOwner()

  return await prisma.notification.count({
    where: { owner_id: owner.id, read: false },
  })
}
