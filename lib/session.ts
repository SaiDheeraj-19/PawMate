import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import prisma from './prisma'

export async function verifySession() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth')
  }
  
  return user
}

export async function getAuthenticatedOwner() {
  const user = await verifySession()
  
  const owner = await prisma.owner.findUnique({
    where: { auth_user_id: user.id },
  })
  
  if (!owner) {
    redirect('/profile')
  }
  
  return owner
}
