'use client'

import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const CARDS = [
  { img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop', color: 'bg-[#1A3D2B]', title: 'Pramium' },
  { img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop', color: 'bg-white', title: 'Companions' },
  { img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop', color: 'bg-white', title: 'Match' },
  { img: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?q=80&w=800&auto=format&fit=crop', color: 'bg-[#F5A623]', title: 'Community' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] overflow-hidden flex flex-col pt-24 font-sans">
      
      {/* Main Hero Layout */}
      <main className="flex-1 flex flex-col lg:flex-row items-center w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 pt-10 pb-32 lg:py-20 lg:pr-12 relative z-20">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-full text-sm font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse"></span>
            Passionate
          </div>
          
          <h1 className="font-serif text-[5rem] lg:text-[7rem] leading-[0.9] text-[#1A3D2B] mb-4">
            PawMate
          </h1>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#1A3D2B] mb-8">
            Premium Pet Matchmaking
          </h2>
          
          <p className="text-[#1A3D2B]/70 text-lg lg:text-xl max-w-lg leading-relaxed mb-12">
            Experience a curated matchmaking environment for the modern companion. Connect with an elite community focused on care and companionship.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#1A3D2B] text-white hover:bg-[#132d20] text-base font-bold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-xl">
                Start Discovering
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-[#1A3D2B] text-[#1A3D2B] hover:bg-[#1A3D2B]/5 text-base font-bold tracking-wide transition-all bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content - Cards Grid */}
        <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[800px] z-20 hidden md:block">
           <div className="absolute inset-0 grid grid-cols-2 gap-6 p-8 relative">
              {CARDS.map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className={`${card.color} rounded-[2rem] p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500`}
                  style={{
                     height: i % 2 === 0 ? '360px' : '400px',
                     marginTop: i % 2 !== 0 ? '40px' : '0'
                  }}
                >
                  <div className="relative w-full flex-1 rounded-[1.5rem] overflow-hidden bg-gray-100">
                    <img src={card.img} alt="Pet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center">
                       <PawPrint className="w-4 h-4 text-[#1A3D2B] fill-[#1A3D2B]" />
                    </div>
                  </div>
                  
                  {card.title && (
                    <div className={`mt-4 mx-2 px-5 py-3 rounded-2xl flex items-center justify-between ${card.color === 'bg-[#1A3D2B]' ? 'bg-white/10 text-white' : card.color === 'bg-[#F5A623]' ? 'bg-white/20 text-white' : 'bg-gray-50 text-[#1A3D2B]'}`}>
                       <span className="font-bold text-sm">{card.title}</span>
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${card.color === 'bg-white' ? 'bg-[#1A3D2B] text-white' : 'bg-white text-[#1A3D2B]'}`}>
                          <PawPrint className="w-3 h-3 fill-current" />
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}
           </div>
        </div>
      </main>

      {/* Amber Wave with Paw Prints */}
      <div className="absolute bottom-0 left-0 w-full z-0 overflow-hidden">
        {/* Abstract paw prints scattered */}
        <div className="absolute bottom-10 left-10 opacity-20 rotate-12"><PawPrint className="w-12 h-12 text-white fill-white" /></div>
        <div className="absolute bottom-24 left-1/4 opacity-30 -rotate-12"><PawPrint className="w-8 h-8 text-white fill-white" /></div>
        <div className="absolute bottom-16 left-1/2 opacity-20 rotate-45"><PawPrint className="w-16 h-16 text-white fill-white" /></div>
        <div className="absolute bottom-8 right-1/4 opacity-40 -rotate-12"><PawPrint className="w-10 h-10 text-white fill-white" /></div>
        
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl translate-y-2">
          <path fill="#F5A623" fillOpacity="1" d="M0,192L48,208C96,224,192,256,288,256C384,256,480,224,576,213.3C672,203,768,213,864,229.3C960,245,1056,267,1152,250.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  )
}
