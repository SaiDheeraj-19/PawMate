'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Upload, X, ShieldCheck, Heart, Sparkles, PawPrint } from 'lucide-react'
import Link from 'next/link'
import { createPet } from '@/app/actions/pets'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

const SPECIES = ['dog', 'cat', 'shiba inu', 'persian', 'bengal', 'retriever', 'frenchie', 'other']
const GENDERS = ['male', 'female']
const SIZES = ['small', 'medium', 'large']
const INTENTS = ['playdate', 'breeding', 'both']
const TEMPERAMENTS = ['friendly', 'calm', 'playful', 'shy', 'energetic', 'intelligent', 'loyal']

export default function NewPetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const supabase = createClient()

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setLoading(true)
    for (let i = 0; i < files.length; i++) {
      if (photos.length >= 6) break
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `pet-photos/${fileName}`
      const { error: uploadError } = await supabase.storage.from('pets').upload(filePath, file)
      if (uploadError) { toast.error('Error uploading photo'); continue }
      const { data: { publicUrl } } = supabase.storage.from('pets').getPublicUrl(filePath)
      setPhotos(prev => [...prev, publicUrl])
    }
    setLoading(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('photos', JSON.stringify(photos))
    formData.append('temperament_tags', JSON.stringify(selectedTags))
    const result = await createPet(formData)
    if (result.success) {
      toast.success(result.success)
      router.push('/profile')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-12 lg:p-24 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="mb-24 relative">
          <Link href="/profile" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#f5f3ef] border border-black/5 text-[#022717]/40 text-[10px] font-bold uppercase tracking-widest mb-12 hover:bg-white hover:text-[#022717] transition-all group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row items-end justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-6">
                Official Intake Process
              </div>
              <h1 className="font-serif text-6xl lg:text-7xl font-bold text-[#022717] mb-8 tracking-tight">Register Resident</h1>
              <p className="text-xl text-[#022717]/50 max-w-lg leading-relaxed font-sans italic">
                Enter your companion into the elite registry. Maintain the legacy with precise data.
              </p>
            </div>
            <div className="w-24 h-24 rounded-3xl bg-[#022717] flex items-center justify-center shadow-xl rotate-6 group overflow-hidden relative">
               <div className="absolute inset-0 bg-[#835500]/10" />
               <PawPrint className="h-10 w-10 text-white" />
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-20">
              {/* Identity Section */}
              <section className="space-y-12">
                <div className="flex items-center gap-6 mb-12 border-b border-black/5 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] border border-black/5 shadow-sm flex items-center justify-center font-serif font-bold text-[#022717]">01</div>
                  <h3 className="font-serif text-2xl font-bold text-[#022717]">Identity &amp; Origin</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Full Name</Label>
                    <Input id="name" name="name" placeholder="Sir Winston..." className="h-16 rounded-md bg-[#f5f3ef]/50 border-none text-[1.1rem] ring-inset ring-black/5 focus:ring-[#022717]/20 transition-all px-6" required />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="species" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Lineage / Species</Label>
                    <Select name="species" defaultValue="dog" required>
                      <SelectTrigger className="h-16 rounded-md bg-[#f5f3ef]/50 border-none text-[1rem] ring-inset ring-black/5 focus:ring-[#022717]/20 transition-all px-6">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-black/5 rounded-xl ambient-shadow">
                        {SPECIES.map(s => <SelectItem key={s} value={s} className="capitalize py-3 px-6 text-[#022717]">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="breed" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Official Breed</Label>
                    <Input id="breed" name="breed" placeholder="Golden Retriever" className="h-16 rounded-md bg-[#f5f3ef]/50 border-none text-[1.1rem] ring-inset ring-black/5 focus:ring-[#022717]/20 transition-all px-6" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="age_months" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Age (Months)</Label>
                    <Input id="age_months" name="age_months" type="number" min="0" placeholder="12" className="h-16 rounded-md bg-[#f5f3ef]/50 border-none text-[1.1rem] ring-inset ring-black/5 focus:ring-[#022717]/20 transition-all px-6" required />
                  </div>
                </div>
              </section>

              {/* Disposition Section */}
              <section className="space-y-12">
                <div className="flex items-center gap-6 mb-12 border-b border-black/5 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] border border-black/5 shadow-sm flex items-center justify-center font-serif font-bold text-[#022717]">02</div>
                  <h3 className="font-serif text-2xl font-bold text-[#022717]">Disposition &amp; Purpose</h3>
                </div>

                <div className="space-y-10">
                  <div className="space-y-6">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Temperament Hallmarks</Label>
                    <div className="flex flex-wrap gap-4">
                      {TEMPERAMENTS.map(tag => (
                        <div 
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 border-2 ${
                            selectedTags.includes(tag) 
                              ? 'bg-[#022717] text-white border-[#022717] shadow-lg' 
                              : 'bg-white text-[#022717]/40 border-black/5 hover:border-[#022717]/20'
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-12 pt-8">
                     <div className="space-y-4">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Gender</Label>
                       <Select name="gender" required>
                         <SelectTrigger className="h-14 rounded-md bg-[#f5f3ef]/50 border-none px-6 ring-inset ring-black/5">
                           <SelectValue placeholder="Gender" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl">
                           {GENDERS.map(g => <SelectItem key={g} value={g} className="capitalize py-3">{g}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-4">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Frame / Size</Label>
                       <Select name="size" required>
                         <SelectTrigger className="h-14 rounded-md bg-[#f5f3ef]/50 border-none px-6 ring-inset ring-black/5">
                           <SelectValue placeholder="Size" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl">
                           {SIZES.map(s => <SelectItem key={s} value={s} className="capitalize py-3">{s}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-4">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Intent</Label>
                       <Select name="intent" required>
                         <SelectTrigger className="h-14 rounded-md bg-[#f5f3ef]/50 border-none px-6 ring-inset ring-black/5">
                           <SelectValue placeholder="Intent" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl">
                           {INTENTS.map(i => <SelectItem key={i} value={i} className="capitalize py-3">{i}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Label htmlFor="description" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Biographical Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Narrate your companion's history and unique spirit..." 
                      className="min-h-[200px] p-8 rounded-xl bg-white border border-black/5 text-[1rem] leading-relaxed ring-inset ring-black/5 focus:ring-[#022717]/20 transition-all font-sans italic" 
                    />
                  </div>

                  <div className="flex items-center gap-4 bg-[#f5f3ef] p-6 rounded-xl border border-black/5">
                    <Checkbox id="is_vaccinated" name="is_vaccinated" value="true" className="w-6 h-6 rounded-md border-[#022717]/10 data-[state=checked]:bg-[#022717] data-[state=checked]:border-[#022717]" />
                    <Label htmlFor="is_vaccinated" className="text-xs font-bold text-[#022717]/60 cursor-pointer flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-green-600" />
                       I certify this resident is up-to-date on all medical vaccinations.
                    </Label>
                  </div>
                </div>
              </section>
            </div>

            {/* Visual Portfolio Column */}
            <div className="space-y-12">
               <div className="bg-white p-10 rounded-[2rem] ambient-shadow border border-black/5 sticky top-32">
                  <header className="mb-10">
                    <h3 className="font-serif text-2xl font-bold text-[#022717] mb-2 text-center">Visual Portfolio</h3>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center text-[#022717]/30">Elite Portraits Only</p>
                  </header>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {photos.map((url, idx) => (
                      <div key={idx} className="aspect-square relative rounded-xl overflow-hidden bg-[#f5f3ef] group animate-fade-in">
                        <img src={url} alt={`Pet ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <button 
                          type="button" 
                          onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {photos.length < 6 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-[#022717]/10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f5f3ef]/50 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[#fbf9f5] border border-black/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="h-5 w-5 text-[#022717]/20" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#022717]/20">Upload</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>

                  <footer className="space-y-8">
                     <div className="p-6 rounded-xl bg-[#fbf9f5] border border-[#ffddb4] border-dashed">
                        <div className="flex gap-4">
                           <Sparkles className="h-5 w-5 text-[#835500] shrink-0" />
                           <p className="text-[10px] text-[#835500] font-bold uppercase leading-relaxed tracking-wider">
                              Ensure portraits are well-lit and professional to increase estate visibility.
                           </p>
                        </div>
                     </div>
                     
                     <Button type="submit" disabled={loading || photos.length === 0} className="w-full h-16 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:bg-[#1a3d2b] transition-all disabled:opacity-20 transform active:scale-95">
                        {loading ? 'Processing Registry...' : 'Submit Entry'}
                     </Button>
                  </footer>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
