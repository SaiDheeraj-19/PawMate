import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // This script assumes you have some auth user IDs already or you can mock them.
  // For a real seed, we need auth.users to exist first if we have FKs.
  // Since we are using UUIDs, we can mock them if RLS is off or if we bypass.
  
  // Note: In Supabase, you'd typically seed the public schema.
  
  const cities = ['New York', 'San Francisco', 'London']
  const owners = [
    { auth_user_id: 'a0e0a951-6981-434e-9a43-3a32335f79a1', name: 'Alice', city: 'New York', lat: 40.7128, lng: -74.0060 },
    { auth_user_id: 'b0e0a951-6981-434e-9a43-3a32335f79a2', name: 'Bob', city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { auth_user_id: 'c0e0a951-6981-434e-9a43-3a32335f79a3', name: 'Charlie', city: 'London', lat: 51.5074, lng: -0.1278 },
  ]

  for (const ownerData of owners) {
    const owner = await prisma.owner.upsert({
      where: { auth_user_id: ownerData.auth_user_id },
      update: {},
      create: ownerData,
    })

    const pets = [
      {
        owner_id: owner.id,
        name: `${ownerData.name}'s Pet 1`,
        species: 'dog',
        breed: 'Golden Retriever',
        age_months: 24,
        gender: 'male',
        size: 'large',
        intent: 'playdate',
        is_vaccinated: true,
        photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'],
        temperament_tags: ['friendly', 'energetic'],
      },
      {
        owner_id: owner.id,
        name: `${ownerData.name}'s Pet 2`,
        species: 'cat',
        breed: 'Siamese',
        age_months: 12,
        gender: 'female',
        size: 'small',
        intent: 'both',
        is_vaccinated: true,
        photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'],
        temperament_tags: ['calm', 'intelligent'],
      }
    ]

    for (const petData of pets) {
      await prisma.pet.create({ data: petData as any })
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
