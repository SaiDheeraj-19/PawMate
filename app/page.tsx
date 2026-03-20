'use client'

import Link from 'next/link'
import { ArrowRight, Star, Quote, PawPrint } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f5]">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-20 px-8 overflow-hidden">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#022717_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
        
        <div className="container relative z-10 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3ef] border border-black/5 text-[#835500] text-[10px] font-bold uppercase tracking-widest mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#835500] animate-pulse" />
              The Premium Digital Estate
            </div>
            
            <h1 className="font-serif text-[5rem] lg:text-[7.5rem] leading-[0.9] text-[#022717] font-bold tracking-tight mb-10">
              Find the perfect <br />
              <span className="italic font-normal text-[#835500]">connection.</span>
            </h1>
            
            <p className="text-xl text-[#022717]/60 mb-12 max-w-lg leading-relaxed font-sans">
              Experience a curated matchmaking environment for the modern companion. Whether for joyful playdates or elite breeding, PawMate ensures safety and elegance.
            </p>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/auth" 
                className="px-10 py-5 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-[#1a3d2b] transition-all duration-300"
              >
                Find a Playdate
              </Link>
              <Link 
                href="/auth?type=breeding" 
                className="px-10 py-5 rounded-md border border-[#022717]/20 text-[#022717] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
              >
                Breeding Match
              </Link>
            </div>
            
            <div className="mt-20 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#022717]/10 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-[#022717]/40" />
                </div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#022717]/40">
                <span className="text-[#835500]">2,400+</span> Successful Matches
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative hidden lg:block">
            {/* Removed placeholder floating cards stack */}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-40 bg-white border-y border-black/5 overflow-hidden">
        <div className="container text-center max-w-4xl mx-auto px-8 relative">
          <Quote className="h-20 w-20 text-[#022717]/5 absolute -top-10 left-1/2 -translate-x-1/2" />
          <h2 className="font-serif text-4xl lg:text-5xl leading-tight text-[#022717] font-medium italic mb-12 px-6">
            &quot;PawMate has redefined the standards for pet socialization. The level of detail and the quality of the community are truly unparalleled in the digital space.&quot;
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#f5f3ef] border border-black/5 overflow-hidden">
              <img src="https://i.pravatar.cc/100?u=eleanor" alt="Eleanor" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#022717]">Eleanor Vance</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#022717]/40">Founding Member & Owner of Ghost</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-40">
        <div className="container px-8">
          <div className="text-center mb-32">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-4">Excellence in Motion</p>
            <h2 className="font-serif text-6xl font-bold text-[#022717] mb-8">How it Works</h2>
            <p className="text-lg text-[#022717]/50 max-w-2xl mx-auto leading-relaxed">
              Our systematic approach ensures every connection within our estate meets the highest standards of safety and compatibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-24 relative max-w-6xl mx-auto">
            {[
              { 
                num: '1', 
                title: 'Curated Pet Profiles', 
                desc: 'Document your pet\'s pedigree, health certifications, and unique temperament. Our refined intake process creates a comprehensive digital footprint for your companion.' 
              },
              { 
                num: '2', 
                title: 'Sophisticated Discovery', 
                desc: 'Utilize advanced filters to locate matches by genetic heritage, behavioral traits, and proximity. Browse verified members within our private, secure network.' 
              },
              { 
                num: '3', 
                title: 'Secure Engagement', 
                desc: 'Initiate conversations through our encrypted messaging system. Arrange private meetings or professional consultations with confidence in our community standards.' 
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-[12rem] font-serif font-bold text-[#022717]/5 absolute -top-32 -left-10 leading-none group-hover:text-[#022717]/10 transition-colors duration-500">
                  {item.num}
                </div>
                <div className="relative pt-10">
                  <div className="w-10 h-10 rounded-full bg-[#022717] flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#022717] mb-6">{item.title}</h3>
                  <p className="text-sm text-[#022717]/50 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-40 bg-[#f5f3ef]/50 border-y border-black/5">
        <div className="container max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { val: '10k+', label: 'Verified Pet Estates' },
              { val: '60+', label: 'Elite Certified Breeds' },
              { val: '4.95', label: 'Community Trust Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="font-serif text-7xl font-bold text-[#022717] mb-4 group-hover:text-[#835500] transition-colors duration-500">{stat.val}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#022717]/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-12 bg-[#022717] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[#835500]/5 pointer-events-none" />
        <div className="container max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-serif text-4xl font-bold mb-4">Ready to join the estate?</h2>
            <p className="text-[#f5f3ef]/60 text-sm max-w-md">Apply for your pet&apos;s digital residency today and connect with a community that values pedigree and play as much as you do.</p>
          </div>
          <Link 
            href="/auth" 
            className="px-12 py-5 rounded-md bg-[#835500] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#a67119] transition-all duration-300"
          >
            Join the Private Network
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#022717] pt-32 pb-16 text-white border-t border-white/5">
        <div className="container px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="font-serif text-3xl font-bold tracking-tight mb-8 flex items-center gap-2">
                <PawPrint className="h-8 w-8 fill-current" />
                PawMate
              </Link>
              <p className="text-[#f5f3ef]/40 text-sm max-w-md leading-relaxed mb-10">
                The premium digital standard for pet connections. Elevating the art of matchmaking through safety, verification, and editorial excellence.
              </p>
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all cursor-pointer">
                  <ArrowRight className="-rotate-45 h-4 w-4" />
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all cursor-pointer">
                  <ArrowRight className="-rotate-45 h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Directory</p>
              <ul className="space-y-4">
                {['Discover Estate', 'Breeding Standards', 'Vetting Process', 'Private Network'].map(l => (
                  <li key={l}><Link href="#" className="text-xs text-[#f5f3ef]/60 hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Inquiries</p>
              <ul className="space-y-4">
                {['Concierge Support', 'Privacy Estate', 'Terms of Residency', 'Contact Us'].map(l => (
                  <li key={l}><Link href="#" className="text-xs text-[#f5f3ef]/60 hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">© 2024 PAWMATE. A PREMIUM PET ESTATE.</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20 italic">Crafted for those who demand the best for their companions</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
