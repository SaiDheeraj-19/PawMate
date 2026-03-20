'use server'

import { getAuthenticatedOwner } from '@/lib/session'
import { petSchema } from '@/lib/validations/schemas'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Pet } from '@prisma/client'

export async function createPet(formData: FormData) {
  const owner = await getAuthenticatedOwner()

  const rawData = {
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed'),
    age_months: parseInt(formData.get('age_months') as string),
    gender: formData.get('gender'),
    size: formData.get('size'),
    intent: formData.get('intent'),
    description: formData.get('description'),
    is_vaccinated: formData.get('is_vaccinated') === 'true',
    temperament_tags: JSON.parse(formData.get('temperament_tags') as string || '[]'),
    photos: JSON.parse(formData.get('photos') as string || '[]'),
  }

  const validated = petSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: 'Invalid pet data' }
  }

  try {
    const pet = await prisma.pet.create({
      data: {
        ...validated.data,
        owner_id: owner.id,
      },
    })

    revalidatePath('/profile')
    revalidatePath('/discover')
    return { success: 'Pet created successfully', id: pet.id }
  } catch {
    return { error: 'Failed to create pet' }
  }
}

export async function updatePet(id: string, formData: FormData) {
  const owner = await getAuthenticatedOwner()

  const rawData = {
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed'),
    age_months: parseInt(formData.get('age_months') as string),
    gender: formData.get('gender'),
    size: formData.get('size'),
    intent: formData.get('intent'),
    description: formData.get('description'),
    is_vaccinated: formData.get('is_vaccinated') === 'true',
    temperament_tags: JSON.parse(formData.get('temperament_tags') as string || '[]'),
    photos: JSON.parse(formData.get('photos') as string || '[]'),
  }

  const validated = petSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: 'Invalid pet data' }
  }

  try {
    // Ensure the pet belongs to the authenticated owner
    const existingPet = await prisma.pet.findFirst({
      where: { id, owner_id: owner.id }
    })

    if (!existingPet) {
      return { error: 'Unauthorized to update this pet' }
    }

    await prisma.pet.update({
      where: { id },
      data: validated.data,
    })

    revalidatePath('/profile')
    revalidatePath('/discover')
    return { success: 'Pet updated successfully' }
  } catch {
    return { error: 'Failed to update pet' }
  }
}

export async function deletePet(id: string) {
  const owner = await getAuthenticatedOwner()

  try {
    // Ensure the pet belongs to the authenticated owner
    const existingPet = await prisma.pet.findFirst({
      where: { id, owner_id: owner.id }
    })

    if (!existingPet) {
      return { error: 'Unauthorized to delete this pet' }
    }

    await prisma.pet.delete({
      where: { id },
    })

    revalidatePath('/profile')
    revalidatePath('/discover')
    return { success: 'Pet deleted successfully' }
  } catch {
    return { error: 'Failed to delete pet' }
  }
}

export async function getPet(id: string): Promise<Pet | null> {
  return await prisma.pet.findUnique({
    where: { id },
  })
}
