'use server'

import { verifySession } from '@/lib/session'
import { profileSchema } from '@/lib/validations/schemas'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const user = await verifySession()
  
  const rawData = {
    name: formData.get('name'),
    bio: formData.get('bio'),
    city: formData.get('city'),
    lat: parseFloat(formData.get('lat') as string) || null,
    lng: parseFloat(formData.get('lng') as string) || null,
  }

  const validated = profileSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: 'Invalid profile data' }
  }

  try {
    await prisma.owner.update({
      where: { auth_user_id: user.id },
      data: validated.data,
    })

    revalidatePath('/profile')
    return { success: 'Profile updated successfully' }
  } catch {
    return { error: 'Failed to update profile' }
  }
}

export async function getProfile() {
  const user = await verifySession()

  return await prisma.owner.findUnique({
    where: { auth_user_id: user.id },
    include: {
      pets: {
        orderBy: { created_at: 'desc' },
      },
    },
  })
}
