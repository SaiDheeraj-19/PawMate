'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PawPrint, X, Heart, Info, MapPin, SlidersHorizontal, ArrowLeft, ArrowRight, ShieldCheck, Search } from 'lucide-react'
import { getPetsToDiscover, swipe } from '@/app/actions/discovery'
import { getProfile } from '@/app/actions/profile'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DiscoverPage() {
  const [myPet, setMyPet] = useState<any>(null)
  const [allMyPets, setAllMyPets] = useState<any[]>([])
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState<'like' | 'pass'>('like')
  const [filters] = useState({
    species: 'all',
    intent: 'all',
    radius: 50,
    minAge: 0,
    maxAge: 240,
  })

  useEffect(() => {
    const init = async () => {
      const profile = await getProfile()
      if (profile?.pets && profile.pets.length > 0) {
        setAllMyPets(profile.pets)
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
    const data = await getPetsToDiscover(myPet.id, filters)
    setPets(data)
    setCurrentIndex(0)
    setLoading(false)
  }

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (currentIndex >= pets.length) return
    setSwipeDir(direction)
    const swipedPet = pets[currentIndex]
    const result = await swipe(myPet.id, swipedPet.id, direction)

    if (result.matchId) {
      toast.success(`It's a Match! 🎉`, {
        description: `You and ${swipedPet.name} liked each other.`,
        action: { label: "Chat Now", onClick: () => window.location.href = `/chat/${result.matchId}` }
      })
    }
    setCurrentIndex(prev => prev + 1)
  }

  if (loading && pets.length === 0) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#022717]/10 border-t-[#022717] animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">Browsing the estate...</p>
      </div>
    </div>
  )

  if (!myPet) return (
    <div className="flex-grow flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="p-16 text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-[#f5f3ef] flex items-center justify-center mx-auto mb-10 shadow-sm border border-black/5">
          <PawPrint className="h-8 w-8 text-[#022717]/50" />
        </div>
        <h2 className="font-serif text-4xl font-bold text-[#022717] mb-8">No Pet Estate Found</h2>
        <p className="text-lg text-[#022717]/50 mb-12 font-sans">You need to register your companion profile first to browse the network.</p>
        <Link 
          href="/pets/new" 
          className="px-10 py-5 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a3d2b] transition-all"
        >
          Register Companion
        </Link>
      </div>
    </div>
  )

  const currentPet = pets[currentIndex]

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-12 lg:p-24 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-24">
        {/* Left Info Column */}
        <header className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-8">
            Sophisticated Discovery
          </div>
          <h1 className="font-serif text-6xl lg:text-[5.5rem] font-bold text-[#022717] mb-12 tracking-tight">Expand the Pack</h1>
          <p className="text-xl text-[#022717]/50 max-w-sm mb-16 leading-relaxed font-sans">
            Browsing as <span className="text-[#022717] font-bold">{myPet.name}</span>. We&apos;ve curated the following elite profiles based on your pedigree and location.
          </p>
          
          <div className="flex flex-col gap-4 items-center md:items-start">
            <select 
              className="bg-[#f5f3ef] border border-black/5 rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#022717]/60 outline-none w-64"
              value={myPet.id}
              onChange={(e) => setMyPet(allMyPets.find(p => p.id === e.target.value))}
            >
              {allMyPets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </header>

        {/* Swipe Area Right Column */}
        <div className="flex-1 relative flex flex-col items-center gap-12">
          <div className="relative w-full max-w-md h-[480px]">
            <AnimatePresence>
              {currentIndex < pets.length ? (
                <motion.div
                  key={currentPet.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ x: swipeDir === 'like' ? 600 : -600, opacity: 0, rotate: swipeDir === 'like' ? 25 : -25 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="absolute inset-0 z-10"
                >
                  <Card className="w-full h-full border-none bg-white rounded-[2rem] p-6 ambient-shadow flex flex-col items-center justify-between">
                    <div className="w-full aspect-[4/5] rounded-2xl bg-[#f5f3ef] overflow-hidden mb-8 relative">
                      {currentPet.photos?.[0] ? (
                        <img src={currentPet.photos[0]} alt={currentPet.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#fbf9f5] flex items-center justify-center">
                          <PawPrint size={64} className="text-[#022717]/5" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        {currentPet.is_vaccinated && (
                          <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full text-center px-4 mb-4">
                      <h2 className="font-serif text-[2.5rem] font-bold text-[#022717] mb-2">{currentPet.name}, {Math.floor(currentPet.age_months / 12) || 1}Y</h2>
                      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022717]/40">{currentPet.breed || currentPet.species}</span>
                        <div className="w-1 h-1 rounded-full bg-[#022717]/20" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#835500]">{currentPet.intent}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#f5f3ef]/50 rounded-[2rem] border border-dashed border-[#022717]/10 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-10 shadow-sm border border-black/5">
                    <Search className="h-8 w-8 text-[#022717]/10" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#022717] mb-6">Discovery Limit</h3>
                  <p className="text-sm text-[#022717]/40 leading-relaxed font-sans mb-10 italic">
                    You&apos;ve reached the end of the current curated estate circle. Expand your radius to view more elite companions.
                  </p>
                  <button 
                    onClick={fetchPets}
                    className="px-8 py-4 rounded-md border border-[#022717]/10 text-[10px] font-bold uppercase tracking-widest text-[#022717] hover:bg-white transition-all shadow-sm"
                  >
                    Refresh Circle
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background pile indicator */}
            <div className="absolute -bottom-2 inset-x-4 h-10 bg-white/50 rounded-[2rem] border border-black/5 -z-10" />
            <div className="absolute -bottom-4 inset-x-8 h-10 bg-white/30 rounded-[2rem] border border-black/5 -z-20" />
          </div>

          {/* Swipe Buttons */}
          {currentIndex < pets.length && (
            <div className="flex items-center gap-12 z-20">
              <button 
                onClick={() => handleSwipe('pass')}
                className="w-20 h-20 rounded-full bg-white text-[#022717]/30 border border-black/5 flex items-center justify-center ambient-shadow hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <X size={40} />
              </button>
              <button 
                onClick={() => handleSwipe('like')}
                className="w-24 h-24 rounded-full bg-[#022717] text-[#835500] border-4 border-[#835500]/20 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 rounded-full animate-ping bg-[#835500]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Heart size={44} fill="#835500" />
              </button>
              <button className="w-20 h-20 rounded-full bg-white text-[#022717]/30 border border-black/5 flex items-center justify-center ambient-shadow hover:text-[#022717] hover:scale-110 active:scale-95 transition-all duration-300">
                <SlidersHorizontal size={32} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
