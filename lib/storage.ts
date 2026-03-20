import { createClient } from './supabase/server'

export async function getSignedUrl(path: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from('pet-photos')
    .createSignedUrl(path, 60 * 60) // 1 hour expiration
    
  if (error) {
    console.error('Error generating signed URL:', error)
    return null
  }
  
  return data.signedUrl
}

export async function uploadFile(file: File) {
  const supabase = createClient()
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
  }
  
  // Validate file size (e.g., 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size too large. Maximum 5MB allowed.')
  }
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`
  
  const { data, error } = await supabase.storage
    .from('pet-photos')
    .upload(filePath, file)
    
  if (error) {
    throw new Error('Failed to upload file.')
  }
  
  return data.path
}
