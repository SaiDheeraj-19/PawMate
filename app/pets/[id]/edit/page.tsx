'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { PawPrint, ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { updatePet, getPet } from '@/app/actions/pets'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const SPECIES = ['dog', 'cat', 'rabbit', 'bird', 'other']
const GENDERS = ['male', 'female']
const SIZES = ['small', 'medium', 'large']
const INTENTS = ['playdate', 'breeding', 'both']
const TEMPERAMENTS = ['friendly', 'calm', 'playful', 'shy', 'energetic', 'intelligent', 'loyal']

export default function EditPetPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pet, setPet] = useState<any>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchPet = async () => {
      const data = await getPet(id as string)
      if (data) {
        setPet(data)
        setPhotos(data.photos || [])
        setSelectedTags(data.temperament_tags || [])
      }
      setLoading(false)
    }
    fetchPet()
  }, [id])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setSaving(true)
    for (let i = 0; i < files.length; i++) {
      if (photos.length >= 6) break
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `pet-photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, file)

      if (uploadError) {
        toast.error('Error uploading photo')
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath)

      setPhotos(prev => [...prev, publicUrl])
    }
    setSaving(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    formData.append('photos', JSON.stringify(photos))
    formData.append('temperament_tags', JSON.stringify(selectedTags))
    
    const result = await updatePet(id as string, formData)
    if (result.success) {
      toast.success(result.success)
      router.push('/profile')
    } else {
      toast.error(result.error)
    }
    setSaving(false)
  }

  if (loading) return <div className="container py-20 text-center">Loading pet details...</div>

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            Edit Pet Profile
          </CardTitle>
          <CardDescription>Update your pet's information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name</Label>
                <Input id="name" name="name" defaultValue={pet?.name} placeholder="Buddy" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <Select name="species" defaultValue={pet?.species} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" name="breed" defaultValue={pet?.breed} placeholder="Golden Retriever" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age_months">Age (Months)</Label>
                <Input id="age_months" name="age_months" type="number" min="0" defaultValue={pet?.age_months} placeholder="12" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={pet?.gender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map(g => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select name="size" defaultValue={pet?.size} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="intent">Looking for...</Label>
                <Select name="intent" defaultValue={pet?.intent} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intent" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTENTS.map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Temperament Tags</Label>
              <div className="flex flex-wrap gap-2">
                {TEMPERAMENTS.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={pet?.description} placeholder="Describe your pet's personality..." />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_vaccinated" name="is_vaccinated" defaultChecked={pet?.is_vaccinated} value="true" />
              <Label htmlFor="is_vaccinated">My pet is up-to-date on vaccinations</Label>
            </div>

            <div className="space-y-4">
              <Label>Photos (Up to 6)</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {photos.map((url, idx) => (
                  <div key={idx} className="aspect-square relative rounded-md overflow-hidden bg-muted">
                    <img src={url} alt={`Pet ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 6 && (
                  <label className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] mt-1 text-muted-foreground">Upload</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Update Pet Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
