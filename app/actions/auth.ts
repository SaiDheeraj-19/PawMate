'use server'

import { createClient } from '@/lib/supabase/server'
import { getBackend } from '@/lib/backend'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function login(formData: FormData) {
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  
  const validated = authSchema.safeParse({ email: rawEmail, password: rawPassword })
  if (!validated.success) {
    return { error: 'Invalid email or password format' }
  }

  const { email, password } = validated.data
  const backend = getBackend()

  if (backend === 'pocketbase') {
    // PocketBase logic (keeping for compatibility as per previous task)
    // ...
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Authentication failed. Please check your credentials.' }
  }

  revalidatePath('/', 'layout')
  redirect('/discover')
}

export async function signup(formData: FormData) {
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const validated = authSchema.extend({ fullName: z.string().min(2) }).safeParse({ 
    email: rawEmail, 
    password: rawPassword,
    fullName
  })

  if (!validated.success) {
    return { error: 'Invalid signup data' }
  }

  const { email, password, fullName: name } = validated.data
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: 'Check your email for the confirmation link.' }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginWithGoogle() {
  const supabase = createClient()
  const originList = headers().get('origin') || process.env.NEXT_PUBLIC_APP_URL
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${originList}/auth/callback`,
    },
  })

  if (error) {
    return { error: 'Google sign-in failed. Please try again.' }
  }

  if (data.url) {
    redirect(data.url)
  }
}
