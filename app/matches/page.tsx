'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart, ChevronRight, MessageSquare, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { getMatches } from '@/app/actions/chat'
import { format } from 'date-fns'
import { getProfile } from '@/app/actions/profile'
import { motion } from 'framer-motion'

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [myOwnerId, setMyOwnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const profile = await getProfile()
      if (profile) setMyOwnerId(profile.id)
      const data = await getMatches()
      setMatches(data)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#022717]/10 border-t-[#022717] animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">Gathering matches...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-12 lg:p-24 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
          <h1 className="font-serif text-6xl lg:text-[5.5rem] font-bold text-[#022717] mb-8 tracking-tight">Your Matches</h1>
          <p className="text-xl text-[#022717]/50 max-w-2xl leading-relaxed font-sans">
            Meet the companions who share your spirit. Your next adventure starts with a simple &quot;Hello&quot;.
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f5f3ef] flex items-center justify-center mx-auto mb-10">
              <Heart className="h-8 w-8 text-[#022717]/10" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#022717]/30 mb-8">No matches found yet</p>
            <Link 
              href="/discover" 
              className="px-10 py-5 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a3d2b] transition-all"
            >
              Discover Estates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {matches.map((match, idx) => {
              const isPetA = match.pet_a.owner_id === myOwnerId
              const myPet = isPetA ? match.pet_a : match.pet_b
              const otherPet = isPetA ? match.pet_b : match.pet_a
              const lastMessage = match.messages[0]
              
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/chat/${match.id}`}>
                    <Card className="border-none bg-white rounded-[2rem] p-8 ambient-shadow hover:scale-[1.02] transition-all duration-500 cursor-pointer group relative overflow-hidden">
                      {/* Hover effect highlight */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#022717]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-10 relative z-10">
                        {/* Overlapping Circles */}
                        <div className="relative h-28 w-44 flex items-center justify-center">
                          <div className="absolute left-0 w-28 h-28 rounded-full border-4 border-white bg-[#f5f3ef] overflow-hidden shadow-sm z-10">
                            <img src={myPet.photos?.[0] || 'https://via.placeholder.com/150'} alt={myPet.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute right-0 w-28 h-28 rounded-full border-4 border-white bg-[#f5f3ef] overflow-hidden shadow-sm">
                            <img src={otherPet.photos?.[0] || 'https://via.placeholder.com/150'} alt={otherPet.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md z-20">
                            <Heart className="h-4 w-4 text-[#835500] fill-[#835500]" />
                          </div>
                        </div>

                        <div className="flex-grow text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500]">You Matched!</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#022717]/20">
                              {match.created_at && format(new Date(match.created_at), 'MMM dd, yyyy')}
                            </span>
                          </div>

                          <h3 className="font-serif text-3xl font-bold text-[#022717] mb-2">{myPet.name} &amp; {otherPet.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#022717]/40 mb-6">
                            {myPet.breed} • {otherPet.breed}
                          </p>

                          <div className="flex items-center gap-4">
                            <p className="text-sm text-[#022717]/60 italic line-clamp-1 flex-grow">
                              {lastMessage ? (
                                <span>&quot;{lastMessage.content}&quot;</span>
                              ) : (
                                <span>No messages yet. Start the conversation.</span>
                              )}
                            </p>
                            {!lastMessage?.read_at && lastMessage?.sender_owner_id !== myOwnerId && (
                              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
