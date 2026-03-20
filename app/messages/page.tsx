'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart, Search, Filter, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getMatches } from '@/app/actions/chat'
import { format } from 'date-fns'
import { getProfile } from '@/app/actions/profile'
import { motion } from 'framer-motion'

export default function MessagesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [myOwnerId, setMyOwnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const profile = await getProfile()
      if (profile) setMyOwnerId(profile.id)
      const data = await getMatches()
      // Filter only those with messages or just show all matches as potential threads
      setMatches(data)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#022717]/10 border-t-[#022717] animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">Fetching messages...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-12 lg:p-24 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="font-serif text-6xl lg:text-[5.5rem] font-bold text-[#022717] mb-8 tracking-tight">Messages</h1>
          <p className="text-xl text-[#022717]/50 max-w-2xl leading-relaxed font-sans">
            Secure, encrypted communication between verified residents of the network.
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f5f3ef] flex items-center justify-center mx-auto mb-10 shadow-sm border border-black/5">
              <MessageSquare className="h-8 w-8 text-[#022717]/10" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#022717]/30 mb-8">No active threads yet</p>
            <Link 
              href="/discover" 
              className="px-10 py-5 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a3d2b] transition-all"
            >
              Start Connection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {matches.map((match, idx) => {
              const isPetA = match.pet_a.owner_id === myOwnerId
              const myPet = isPetA ? match.pet_a : match.pet_b
              const otherPet = isPetA ? match.pet_b : match.pet_a
              const lastMessage = match.messages[0]
              const unread = lastMessage && !lastMessage.read_at && lastMessage.sender_owner_id !== myOwnerId
              
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/chat/${match.id}`}>
                    <Card className={`border-none ${unread ? 'bg-white' : 'bg-[#f5f3ef]/30'} rounded-3xl p-6 sm:p-10 ambient-shadow hover:bg-white hover:scale-[1.01] transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
                       <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-8 lg:gap-12 relative z-10">
                          <div className="relative">
                            <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                              <AvatarImage src={otherPet.photos?.[0]} className="object-cover" />
                              <AvatarFallback className="bg-[#022717] text-white">{otherPet.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                               <Heart className="h-3 w-3 text-[#835500] fill-[#835500]" />
                            </div>
                          </div>

                          <div className="flex-grow text-center sm:text-left">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                                   <h3 className="font-serif text-3xl font-bold text-[#022717]">{otherPet.name}</h3>
                                   <ShieldCheck className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#022717]/20">
                                   {lastMessage ? format(new Date(lastMessage.created_at), 'h:mm a') : 'New Match'}
                                </span>
                             </div>

                             <div className="flex items-center justify-between gap-6">
                                <p className={`text-sm leading-relaxed line-clamp-1 max-w-lg ${unread ? 'text-[#022717] font-bold italic' : 'text-[#022717]/50'}`}>
                                   {lastMessage ? (
                                      <span>&quot;{lastMessage.content}&quot;</span>
                                   ) : (
                                      <span>Established connection. Start the conversation.</span>
                                   )}
                                </p>
                                {unread && (
                                   <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                )}
                                <ChevronRight className="h-6 w-6 text-[#022717]/10 group-hover:text-[#022717]/40 transition-all opacity-0 sm:opacity-100" />
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

        <footer className="mt-32 pt-20 border-t border-black/5 text-center">
           <div className="inline-flex items-center gap-2 mb-6">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#022717]/30">Communication Network Secure</span>
           </div>
        </footer>
      </div>
    </div>
  )
}
