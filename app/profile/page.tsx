'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PawPrint, Edit2, Plus, LogOut, MapPin, Award, ShieldCheck, Heart } from 'lucide-react'
import { getProfile, updateProfile } from '@/app/actions/profile'
import { logout } from '@/app/actions/auth'
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
    <div className="min-h-screen bg-[#fbf9f5] p-12 lg:p-24 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row items-center gap-16 md:text-left text-center">
          {/* Avatar Header */}
          <div className="relative group">
            <div className="w-48 h-48 rounded-full border-4 border-white bg-[#f5f3ef] ambient-shadow overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-[#022717] text-white text-4xl">{profile?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full gradient-bg flex items-center justify-center border-4 border-[#fbf9f5] shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-grow">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-6">
              Elite Estate Member
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <Input name="name" defaultValue={profile?.name} className="font-serif text-5xl font-bold bg-transparent border-none p-0 h-auto focus:ring-0 text-[#022717]" autoFocus />
                <Textarea name="bio" defaultValue={profile?.bio} className="text-lg text-[#022717]/50 font-sans border-none p-0 resize-none bg-transparent focus:ring-0 min-h-[100px]" placeholder="Tell the network about you..." />
                <div className="flex items-center gap-4 relative">
                  <MapPin className="h-4 w-4 text-[#835500]" />
                  <Input name="city" defaultValue={profile?.city} className="bg-transparent border-none p-0 h-auto focus:ring-0 text-[11px] font-bold uppercase tracking-widest text-[#022717]/40" placeholder="Your City" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={saving} className="px-8 py-3 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-widest shadow-xl disabled:opacity-50">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-md border border-[#022717]/10 text-[11px] font-bold uppercase tracking-widest text-[#022717]/60">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="relative group">
                <h1 className="font-serif text-6xl lg:text-7xl font-bold text-[#022717] mb-6 tracking-tight">
                  {profile?.name}
                </h1>
                <p className="text-xl text-[#022717]/50 max-w-lg mb-8 leading-relaxed font-sans italic">
                  &quot;{profile?.bio || 'An estate resident who hasn\'t updated their story yet.'}&quot;
                </p>
                <div className="flex items-center gap-6 mb-10">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#022717]/30">
                    <MapPin className="h-3 w-3 text-[#835500]" />
                    {profile?.city || 'Undisclosed Estate'}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#022717]/30">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    Verified Resident
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 rounded-md bg-[#f5f3ef] border border-black/5 text-[#022717]/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#022717] transition-all flex items-center gap-2"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Pets Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-4">Companion Circle</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#022717]">The Residents</h2>
            </div>
            <Link 
              href="/pets/new" 
              className="px-8 py-4 rounded-md bg-[#022717] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a3d2b] flex items-center gap-2 transition-all transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4" />
              Register New Pet
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {profile?.pets?.map((pet: any, idx: number) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <Link href={`/pets/${pet.id}/edit`}>
                  <Card className="border-none bg-white rounded-[2rem] p-6 ambient-shadow hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden border border-black/0 hover:border-black/5">
                    <div className="w-full aspect-square rounded-2xl bg-[#f5f3ef] overflow-hidden mb-6 relative">
                      <img src={pet.photos?.[0]} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 flex gap-2">
                         <div className="floating-badge">Member</div>
                      </div>
                    </div>
                    <div className="px-2">
                       <h3 className="font-serif text-3xl font-bold text-[#022717] mb-2">{pet.name}</h3>
                       <div className="flex items-center gap-3 mb-6">
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022717]/40">{pet.breed || pet.species}</span>
                         <div className="w-1 h-1 rounded-full bg-[#022717]/20" />
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#835500]">{pet.intent}</span>
                       </div>
                       <div className="flex items-center justify-between text-[#022717]/30 text-[9px] font-bold uppercase tracking-widest border-t border-black/5 pt-6 group-hover:text-[#022717]/60 transition-colors">
                          <div className="flex items-center gap-1.5"><Heart className="h-3 w-3" /> {pet.age_months} Months</div>
                          <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Protected</div>
                       </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {/* Empty Statte Plate */}
            {(!profile?.pets || profile.pets.length === 0) && (
               <div className="col-span-full h-80 rounded-[2rem] border-2 border-dashed border-[#022717]/10 flex flex-col items-center justify-center text-center p-12 bg-[#f5f3ef]/30">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                   <Plus className="h-6 w-6 text-[#022717]/20" />
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
