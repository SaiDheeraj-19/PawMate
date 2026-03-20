'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Camera, X, ShieldCheck, Heart, Sparkles, PawPrint } from 'lucide-react'
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
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream
    }
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaStream, isCameraOpen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraOpen(true)
    } catch {
      toast.error('Secure camera access is required. Uploads are strictly disabled.')
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      setLoading(true)
      canvas.toBlob(async (blob) => {
        if (!blob) { setLoading(false); return }
        
        // Upload immediately to Supabase
        const fileName = `${Math.random()}.jpg`
        const filePath = `pet-photos/${fileName}`
        const { error: uploadError } = await supabase.storage.from('pets').upload(filePath, blob)
        
        if (uploadError) { 
          toast.error('Verification capture failed securely.') 
        } else {
          const { data: { publicUrl } } = supabase.storage.from('pets').getPublicUrl(filePath)
          setPhotos(prev => [...prev, publicUrl])
        }
        setLoading(false)
        stopCamera()
      }, 'image/jpeg', 0.8)
    }
  }

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }
    setMediaStream(null)
    setIsCameraOpen(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (photos.length === 0) {
      toast.error('You must capture at least one live verification photo.')
      return
    }
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
    <div className="min-h-screen w-full bg-[#fbf9f5] p-6 md:pl-72 lg:p-16 lg:pl-80 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 relative">
          <Link href="/profile" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-black/5 text-[#022717]/40 text-[10px] font-bold uppercase tracking-widest shadow-sm mb-12 hover:bg-white hover:text-[#022717] transition-all group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Estate
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-6">
                Official Intake Process
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-[#022717] mb-4 tracking-tight">Register Resident</h1>
              <p className="text-lg text-[#022717]/50 max-w-lg leading-relaxed font-sans italic">
                Enter your companion into the elite registry using strict live-camera security.
              </p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-[#022717] flex items-center justify-center shadow-xl rotate-6 group overflow-hidden relative shrink-0">
               <div className="absolute inset-0 bg-[#835500]/10" />
               <PawPrint className="h-8 w-8 text-white" />
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* Identity Section */}
              <section className="space-y-10">
                <div className="flex items-center gap-6 mb-8 border-b border-black/5 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#f5f3ef] border border-black/5 shadow-sm flex items-center justify-center font-serif font-bold text-[#022717]">01</div>
                  <h3 className="font-serif text-xl font-bold text-[#022717]">Identity &amp; Origin</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Full Name</Label>
                    <Input id="name" name="name" className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5 focus:border-[#835500] focus:ring-1 focus:ring-[#835500] transition-all" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="species" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Lineage / Species</Label>
                    <Select name="species" defaultValue="dog" required>
                      <SelectTrigger className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5 focus:border-[#835500] focus:ring-1 focus:ring-[#835500] transition-all">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-black/5 rounded-xl shadow-xl">
                        {SPECIES.map(s => <SelectItem key={s} value={s} className="capitalize py-3 text-[#022717]">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="breed" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Official Breed</Label>
                    <Input id="breed" name="breed" className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5 focus:border-[#835500] focus:ring-1 focus:ring-[#835500] transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age_months" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Age (Months)</Label>
                    <Input id="age_months" name="age_months" type="number" min="0" className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5 focus:border-[#835500] focus:ring-1 focus:ring-[#835500] transition-all" required />
                  </div>
                </div>
              </section>

              {/* Disposition Section */}
              <section className="space-y-10">
                <div className="flex items-center gap-6 mb-8 border-b border-black/5 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#f5f3ef] border border-black/5 shadow-sm flex items-center justify-center font-serif font-bold text-[#022717]">02</div>
                  <h3 className="font-serif text-xl font-bold text-[#022717]">Disposition</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Temperament Hallmarks</Label>
                    <div className="flex flex-wrap gap-3">
                      {TEMPERAMENTS.map(tag => (
                        <div 
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 border-2 ${
                            selectedTags.includes(tag) 
                              ? 'bg-[#022717] text-white border-[#022717] shadow-md' 
                              : 'bg-white text-[#022717]/40 border-black/5 hover:border-[#022717]/20 shadow-sm'
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 pt-4">
                     <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Gender</Label>
                       <Select name="gender" required>
                         <SelectTrigger className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5">
                           <SelectValue placeholder="Gender" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl shadow-xl">
                           {GENDERS.map(g => <SelectItem key={g} value={g} className="capitalize py-3 text-[#022717]">{g}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Frame / Size</Label>
                       <Select name="size" required>
                         <SelectTrigger className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5">
                           <SelectValue placeholder="Size" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl shadow-xl">
                           {SIZES.map(s => <SelectItem key={s} value={s} className="capitalize py-3 text-[#022717]">{s}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Intent</Label>
                       <Select name="intent" required>
                         <SelectTrigger className="h-14 rounded-xl bg-white border border-black/5 shadow-sm text-base px-5">
                           <SelectValue placeholder="Intent" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-black/5 rounded-xl shadow-xl">
                           {INTENTS.map(i => <SelectItem key={i} value={i} className="capitalize py-3 text-[#022717]">{i}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Label htmlFor="description" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#022717]/40">Biographical Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      className="min-h-[160px] p-6 rounded-2xl bg-white border border-black/5 shadow-sm text-base leading-relaxed focus:border-[#835500] focus:ring-1 focus:ring-[#835500] transition-all font-sans italic" 
                    />
                  </div>

                  <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <Checkbox id="is_vaccinated" name="is_vaccinated" value="true" className="w-5 h-5 rounded border-black/10 data-[state=checked]:bg-[#022717] data-[state=checked]:border-[#022717]" />
                    <Label htmlFor="is_vaccinated" className="text-[11px] font-bold text-[#022717]/80 uppercase tracking-widest cursor-pointer flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                       I certify this resident is medically vaccinated.
                    </Label>
                  </div>
                </div>
              </section>
            </div>

            {/* Visual Portfolio Column (Live Capture Only) */}
            <div className="space-y-8">
               <div className="bg-white p-8 rounded-[2rem] ambient-shadow border border-black/5 sticky top-12">
                  <header className="mb-8">
                    <h3 className="font-serif text-xl font-bold text-[#022717] mb-2 text-center">Live Identity Scan</h3>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center text-[#022717]/40">Visual Verification</p>
                  </header>

                  <div className="bg-[#f5f3ef] rounded-2xl p-4 mb-6 border border-[#835500]/10 flex gap-3 text-left">
                     <ShieldCheck className="w-5 h-5 text-[#835500] shrink-0" />
                     <p className="text-[10px] text-[#022717]/60 uppercase tracking-widest font-bold leading-relaxed">
                       File uploads are strictly disabled. Capture a live photo using your camera to ensure authenticity.
                     </p>
                  </div>

                  <div className="w-full bg-[#022717] rounded-3xl overflow-hidden aspect-[4/5] relative flex items-center justify-center mb-6 shadow-inner border border-black/10">
                    <canvas ref={canvasRef} className="hidden" />
                    {isCameraOpen ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                           <Button type="button" onClick={capturePhoto} disabled={loading} className="rounded-full h-14 px-8 bg-white text-[#022717] hover:bg-gray-100 shadow-xl font-bold text-[10px] uppercase tracking-widest">
                             {loading ? 'Securing...' : 'Capture Image'}
                           </Button>
                        </div>
                        <button type="button" onClick={stopCamera} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
                           <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-10 h-10 text-white/30 mb-4" />
                        <Button type="button" onClick={startCamera} className="rounded-full bg-[#835500] hover:bg-[#a66d00] text-white text-[10px] uppercase font-bold tracking-widest h-12 px-6 shadow-lg shadow-[#835500]/20">
                          Enable Camera
                        </Button>
                      </div>
                    )}
                  </div>

                  {photos.length > 0 && (
                    <div className="mb-6 grid grid-cols-3 gap-2">
                       {photos.map((url, idx) => (
                         <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group">
                            <img src={url} alt="Captured" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                               <X className="w-3 h-3" />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}

                  <footer className="space-y-6">
                     <Button type="submit" disabled={loading || photos.length === 0} className="w-full h-16 rounded-xl bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:bg-[#1a3d2b] transition-all disabled:opacity-30">
                        {loading ? 'Processing...' : 'Submit Identity'}
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
