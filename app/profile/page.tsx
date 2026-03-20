'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PawPrint, Edit2, Plus, MapPin, ShieldCheck } from 'lucide-react'
import { getProfile, updateProfile } from '@/app/actions/profile'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    if (result.success) {
      toast.success(result.success)
      setIsEditing(false)
      const data = await getProfile()
      setProfile(data)
    } else {
      toast.error(result.error)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#022717]/10 border-t-[#022717] animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">Gathering profile...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] p-6 md:pl-72 lg:p-16 lg:pl-80 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Banner area */}
        <div className="w-full h-48 rounded-[2rem] bg-[#022717] relative mb-16 overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px:40px] opacity-[0.05]" />
           <div className="absolute -bottom-12 left-12">
              <div className="relative group w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#fbf9f5] bg-[#f5f3ef] ambient-shadow overflow-hidden">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={profile?.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-[#835500] text-white text-4xl">{profile?.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
              </div>
           </div>
        </div>

        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pl-0 md:pl-56">
          <div className="flex-grow">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-3">
               Verified Estate Member
               <ShieldCheck className="h-4 w-4 text-green-600 ml-2" />
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                <Input name="name" defaultValue={profile?.name} className="font-serif text-3xl font-bold bg-[#f5f3ef]/50 border-none p-4 h-auto rounded-xl focus:ring-1 focus:ring-[#835500] text-[#022717]" autoFocus />
                <Textarea name="bio" defaultValue={profile?.bio} className="text-sm text-[#022717]/60 font-sans border-none p-4 rounded-xl resize-none bg-[#f5f3ef]/50 focus:ring-1 focus:ring-[#835500] min-h-[100px]" placeholder="Tell the network about you..." />
                <div className="flex items-center gap-4 relative">
                  <Input name="city" defaultValue={profile?.city} className="bg-[#f5f3ef]/50 border-none p-4 rounded-xl text-sm font-bold tracking-widest text-[#022717]" placeholder="Your City & Estate" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={saving} className="flex-1 py-4 rounded-xl bg-[#022717] text-white text-[10px] font-bold uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-[#1a3d2b] transition-all">Save Profile</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-xl border border-[#022717]/10 text-[10px] font-bold uppercase tracking-widest text-[#022717]/60 hover:bg-black/5 transition-all">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="relative group mt-4 md:mt-0">
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#022717] mb-4 tracking-tight">
                  {profile?.name}
                </h1>
                <p className="text-lg text-[#022717]/50 max-w-xl mb-6 leading-relaxed font-sans italic">
                  &quot;{profile?.bio || 'An estate resident who hasn\'t updated their story yet.'}&quot;
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#022717]/40 bg-white px-4 py-2 rounded-full shadow-sm border border-black/5">
                    <MapPin className="h-3 w-3 text-[#835500]" />
                    {profile?.city || 'Undisclosed Estate'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-4 rounded-xl bg-white border border-black/5 text-[#022717] text-[10px] font-bold uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Edit2 className="h-3 w-3 text-[#835500]" />
              Modify Identity
            </button>
          )}
        </header>

        {/* Pets Section */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-black/5 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-2">Companion Circle</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#022717]">The Residents</h2>
            </div>
            <Link 
              href="/pets/new" 
              className="px-6 py-4 rounded-xl bg-[#022717] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a3d2b] flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              Register New Pet
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile?.pets?.map((pet: any, idx: number) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <Link href={`/pets/${pet.id}/edit`}>
                  <Card className="border-none bg-white rounded-3xl p-5 ambient-shadow hover:-translate-y-2 transition-transform duration-500 cursor-pointer overflow-hidden border border-black/0 hover:border-black/5">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-[#f5f3ef] overflow-hidden mb-5 relative">
                      {pet.photos?.[0] ? (
                        <img src={pet.photos[0]} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#022717]/5">
                           <PawPrint size={32} className="text-[#022717]/20" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {pet.is_vaccinated && (
                          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-green-700 flex items-center gap-1 shadow-sm border border-white/20">
                            <ShieldCheck className="h-3 w-3" /> Protected
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-2">
                       <h3 className="font-serif text-2xl font-bold text-[#022717] mb-2" style={{wordBreak: "break-word"}}>{pet.name}</h3>
                       <div className="flex items-center gap-2 mb-4">
                         <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-[#022717]/10 text-[#022717]/60">
                           {pet.breed || pet.species}
                         </Badge>
                         <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-[#835500]/20 text-[#835500] bg-[#835500]/5">
                           {pet.intent}
                         </Badge>
                       </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {(!profile?.pets || profile.pets.length === 0) && (
               <div className="col-span-full h-64 rounded-3xl border-2 border-dashed border-[#022717]/10 flex flex-col items-center justify-center text-center p-12 bg-white/50">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-black/5">
                   <PawPrint className="h-6 w-6 text-[#022717]/20" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#022717]/40">No companion estates registered yet</p>
               </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
