'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Heart, PawPrint, X, Filter, Navigation, Home, Search, MessageSquare, User } from 'lucide-react'
import { getPetsToDiscover, swipe } from '@/app/actions/discovery'
import { getProfile } from '@/app/actions/profile'
import { toast } from 'sonner'

export default function DiscoverPage() {
  const [myPet, setMyPet] = useState<any>(null)
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const profile = await getProfile()
      if (profile?.pets && profile.pets.length > 0) {
        setMyPet(profile.pets[0])
      }
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (myPet) {
      fetchPets()
    }
  }, [myPet])

  const fetchPets = async () => {
    setLoading(true)
    const data = await getPetsToDiscover(myPet.id, { species: 'all', intent: 'all', minAge: 0, maxAge: 240 })
    setPets(data)
    setLoading(false)
  }

  const handleSwipe = async (targetPet: any, direction: 'like' | 'pass') => {
    setPets(prev => prev.filter(p => p.id !== targetPet.id))
    const result = await swipe(myPet.id, targetPet.id, direction)
    if (result.matchId) {
      toast.success(`It's a Match! 🎉`, {
        description: `You and ${targetPet.name} liked each other.`,
      })
    }
  }

  if (loading && pets.length === 0) return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center">
      <PawPrint className="w-12 h-12 text-[#1A3D2B] animate-bounce" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F4] pr-0 xl:pr-[380px] p-8 lg:p-12 font-sans relative">
      
      {/* Header and Filter Buttons */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h1 className="font-serif text-3xl lg:text-4xl text-[#1A3D2B]">
            Pet Matchmaking PawMate.
          </h1>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full bg-white text-[#1A3D2B] text-sm font-bold shadow-sm whitespace-nowrap">
              Dogs
            </button>
            <button className="px-6 py-2 rounded-full bg-[#1A3D2B] text-white text-sm font-bold shadow-md whitespace-nowrap">
              Cats
            </button>
            <button className="px-6 py-2 rounded-full bg-white text-[#1A3D2B] text-sm font-bold shadow-sm whitespace-nowrap flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Pet Grid - 2 or 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, idx) => (
            <Card key={pet.id} className={`overflow-hidden rounded-[2rem] border-none shadow-xl ${idx % 3 === 0 ? 'bg-[#F5A623]' : idx % 3 === 1 ? 'bg-[#1A3D2B]' : 'bg-[#FAF8F4]'} flex flex-col transition-transform duration-300 hover:-translate-y-2`}>
              <div className="p-4 flex-1">
                <div className="w-full aspect-square rounded-2xl bg-white overflow-hidden mb-4 relative">
                  {pet.photos?.[0] ? (
                    <img src={pet.photos[0]} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <PawPrint className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Decorative badge in corner */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <PawPrint className="w-4 h-4" />
                  </div>
                </div>
                
                <h3 className={`font-sans text-xl font-bold mb-1 ${idx % 3 === 1 ? 'text-white' : 'text-[#1A3D2B]'}`}>
                  {pet.name}, {Math.floor(pet.age_months / 12) || 1}
                </h3>
                <p className={`text-sm mb-4 font-sans ${idx % 3 === 1 ? 'text-white/70' : 'text-[#1A3D2B]/70'}`}>
                  {pet.breed || pet.species} • {pet.intent}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className={`p-4 flex items-center justify-between rounded-b-[2rem] ${idx % 3 === 1 ? 'bg-white/10' : 'bg-white/50 border-t border-black/5'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx % 3 === 1 ? 'bg-white/20 text-white' : 'bg-[#1A3D2B]/10 text-[#1A3D2B]'}`}>
                     <Navigation className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold font-sans ${idx % 3 === 1 ? 'text-white' : 'text-[#1A3D2B]'}`}>2.5km away</span>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleSwipe(pet, 'pass')} className={`w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform ${idx % 3 === 1 ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-white text-gray-500 shadow-sm'}`}>
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleSwipe(pet, 'like')} className="w-8 h-8 rounded-full bg-[#1A3D2B] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          
          {pets.length === 0 && !loading && (
            <div className="col-span-full h-80 flex items-center justify-center">
               <p className="text-[#1A3D2B]/50 font-serif text-xl">No more pets found in your area.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mobile Preview Right Column */}
      <div className="hidden xl:block fixed right-10 top-1/2 -translate-y-1/2 w-[340px] h-[700px] bg-white rounded-[3rem] border-8 border-gray-100 shadow-2xl overflow-hidden z-20">
         {/* Mobile Header */}
         <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
           <div className="flex items-center gap-2 font-serif font-bold text-xl text-[#1A3D2B]">
              <PawPrint className="w-5 h-5 fill-current" />
              PawMate
           </div>
           <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A3D2B]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A3D2B]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A3D2B]"></div>
           </div>
         </div>

         {/* Mobile Content (Mockup Text) */}
         <div className="p-6">
           <h2 className="font-serif text-[28px] text-[#1A3D2B] leading-tight mb-4">
             DM Sans
           </h2>
           <p className="font-sans text-[10px] text-gray-500 mb-6 leading-relaxed">
             Perfect for mobile tracking and connection filtering to combine community habitats with advanced selection.
           </p>

           <div className="p-4 rounded-xl bg-[#1A3D2B] text-white flex justify-between items-center shadow-lg mb-6">
              <div className="flex items-center gap-2 font-serif text-lg">
                 <PawPrint className="w-4 h-4 fill-white" />
                 PlayFair
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">+</div>
           </div>

           {/* Mobile Grid */}
           <div className="grid grid-cols-2 gap-3 pb-24 h-[400px] overflow-hidden">
             {pets.slice(0, 4).map((pet, i) => (
                <div key={i} className={`rounded-xl p-2 flex flex-col ${i % 2 === 0 ? 'bg-[#F5A623]' : 'bg-[#1A3D2B]'}`}>
                   <div className="w-full h-20 bg-white rounded-lg mb-2 overflow-hidden">
                      {pet.photos?.[0] ? <img src={pet.photos[0]} className="w-full h-full object-cover" /> : null}
                   </div>
                   <span className="font-bold text-[9px] text-white mb-0.5">{pet.name}</span>
                   <span className="text-[7px] text-white/70">{pet.breed}</span>
                </div>
             ))}
           </div>
         </div>

         {/* Mobile Bottom Nav */}
         <div className="absolute bottom-0 w-full h-[72px] bg-[#1A3D2B] rounded-t-3xl flex items-center justify-between px-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="p-2 w-10 flex justify-center text-white/50"><Home className="w-5 h-5" /></div>
            <div className="p-2 w-10 flex justify-center text-[#F5A623]"><Search className="w-5 h-5" /></div>
            <div className="p-2 w-12 h-12 -mt-6 bg-[#F5A623] rounded-full flex items-center justify-center shadow-lg shadow-[#F5A623]/30 text-white">
               <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <div className="p-2 w-10 flex justify-center text-white/50"><MessageSquare className="w-5 h-5" /></div>
            <div className="p-2 w-10 flex justify-center text-white/50"><User className="w-5 h-5" /></div>
         </div>
      </div>

    </div>
  )
}
