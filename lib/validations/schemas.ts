import { z } from 'zod'

export const petSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(['dog', 'cat', 'rabbit', 'bird', 'other']),
  breed: z.string().max(100).optional().nullable(),
  age_months: z.number().int().min(0).max(240),
  gender: z.enum(['male', 'female']),
  size: z.enum(['small', 'medium', 'large']),
  intent: z.enum(['playdate', 'breeding', 'both']),
  description: z.string().max(500).optional().nullable(),
  is_vaccinated: z.boolean().default(false),
  temperament_tags: z.array(z.string()).max(10),
  photos: z.array(z.string()).max(5),
})

export const swipeSchema = z.object({
  swiper_pet_id: z.string().uuid(),
  swiped_pet_id: z.string().uuid(),
  direction: z.enum(['like', 'pass']),
})

export const messageSchema = z.object({
  match_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional().nullable(),
  city: z.string().min(1).max(100),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
})
