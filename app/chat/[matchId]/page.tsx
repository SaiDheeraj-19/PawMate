'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, ArrowLeft, MoreVertical, ShieldCheck, MapPin, Heart, ArrowRight } from 'lucide-react'
import { getMatch, sendMessage, markAsRead } from '@/app/actions/chat'
import { getProfile } from '@/app/actions/profile'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatPage() {
  const { matchId } = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [myOwnerId, setMyOwnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const profile = await getProfile()
      if (profile) setMyOwnerId(profile.id)
      const data = await getMatch(matchId as string)
      if (data) {
        setMatch(data)
        setMessages(data.messages || [])
        await markAsRead(matchId as string)
      }
      setLoading(false)
    }
    init()

    // Real-time listener
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        if (payload.new.sender_owner_id !== myOwnerId) {
          markAsRead(matchId as string)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, myOwnerId, supabase])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !myOwnerId) return
    const currentMsg = newMessage
    setNewMessage('')
    await sendMessage(matchId as string, currentMsg)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#022717]/10 border-t-[#022717] animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">Securing connection...</p>
      </div>
    </div>
  )

  if (!match) return <div className="p-20 text-center">Connection not found.</div>

  const isPetA = match.pet_a.owner_id === myOwnerId
  const myPet = isPetA ? match.pet_a : match.pet_b
  const otherPet = isPetA ? match.pet_b : match.pet_a

  return (
    <div className="flex flex-col h-screen bg-[#fbf9f5] overflow-hidden">
      {/* Header Area */}
      <header className="fixed top-0 inset-x-0 lg:left-64 h-24 bg-[#fbf9f5]/80 backdrop-blur-xl border-b border-black/5 z-30 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 rounded-full hover:bg-white transition-all text-[#022717]/40">
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 border border-black/5">
                <AvatarImage src={otherPet.photos?.[0]} className="object-cover" />
                <AvatarFallback>{otherPet.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
                <Heart className="h-2.5 w-2.5 text-[#835500] fill-[#835500]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                 <h2 className="font-serif text-2xl font-bold text-[#022717]">{otherPet.name}</h2>
                 <ShieldCheck className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#022717]/30">
                {otherPet.breed} • Owner: {otherPet.owner?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-full hover:bg-white transition-all text-[#022717]/40">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-grow pt-24 pb-24 overflow-y-auto px-8 lg:px-16 custom-scrollbar">
        <div className="max-w-4xl mx-auto py-12 flex flex-col gap-8">
           {/* Date Header */}
           <div className="flex justify-center mb-8">
             <span className="px-4 py-1.5 rounded-full bg-[#f5f3ef] border border-black/5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#022717]/40">
                {match.created_at && format(new Date(match.created_at), 'MMMM dd, yyyy')} • Official Match
             </span>
           </div>

           {messages.map((msg, idx) => {
             const isMe = msg.sender_owner_id === myOwnerId
             return (
               <motion.div 
                 key={msg.id || idx}
                 initial={{ opacity: 0, scale: 0.95, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`max-w-[70%] group`}>
                   <div className={`px-6 py-4 rounded-[1.5rem] shadow-sm transform transition-all ${
                     isMe 
                       ? 'bg-[#022717] text-white rounded-tr-none' 
                       : 'bg-white text-[#022717] border border-black/5 rounded-tl-none'
                   }`}>
                     <p className="text-sm leading-relaxed">{msg.content}</p>
                   </div>
                   <div className={`mt-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.1em] text-[#022717]/20 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {msg.created_at && format(new Date(msg.created_at), 'h:mm a')}
                      {isMe && msg.read_at && (
                        <div className="flex items-center gap-0.5">
                           <span>• Seen</span>
                        </div>
                      )}
                   </div>
                 </div>
               </motion.div>
             )
           })}
           <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="fixed bottom-0 inset-x-0 lg:left-64 bg-[#fbf9f5]/80 backdrop-blur-xl border-t border-black/5 py-6 px-8 z-30">
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Send a curated message to ${otherPet.owner?.name}...`}
              className="h-16 pl-8 pr-20 rounded-[1.5rem] bg-white border-black/5 shadow-sm text-[#022717] placeholder:text-[#022717]/30 focus:shadow-md transition-all ring-inset ring-black/5 focus:ring-[#022717]/20"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#022717] text-white flex items-center justify-center hover:bg-[#1a3d2b] transition-all disabled:opacity-20 shadow-lg"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  )
}
