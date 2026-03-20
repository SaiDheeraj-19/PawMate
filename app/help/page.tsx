'use client'

import { Card } from '@/components/ui/card'
import { HelpCircle, Mail, Phone, FileText, ExternalLink, MessageSquare, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      question: "How does the identity verification process work?",
      answer: "We employ strict visual verification standards. This requires live visualization of both the Estate Member (you) and your companion. You cannot upload pre-recorded videos to ensure authentic and safe environments."
    },
    {
      question: "What happens if a match is formed?",
      answer: "Upon a mutual 'like' from both estates, a private encrypted chat channel opens up automatically. You can find this inside the Messages tab."
    },
    {
      question: "Can I manage multiple companion profiles?",
      answer: "Yes. Elite Estate Members can manage an unlimited number of registered companions under one master profile. However, each companion requires its own verification scan."
    },
    {
      question: "How is my data protected?",
      answer: "All profiles and chat logs are end-to-end encrypted using AES-256 standards. Our servers strictly handle matching algorithms without exposing underlying sensitive location data."
    }
  ]

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] p-6 md:pl-72 lg:p-16 lg:pl-80 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-3">
            Estate Support
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#022717] mb-4 tracking-tight">
            Help & Concierge
          </h1>
          <p className="text-[#022717]/50 font-sans max-w-xl">
            Access dedicated assistance for your digital estate and companion profiles.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Support Options */}
          <Card className="bg-[#022717] border-none rounded-3xl p-6 text-white ambient-shadow relative overflow-hidden group cursor-pointer hover:-translate-y-2 transition-transform duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px:40px] opacity-[0.05]" />
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                 <MessageSquare className="w-5 h-5 text-white" />
               </div>
               <h3 className="font-bold text-lg mb-2 text-white/90">Live Concierge</h3>
               <p className="text-[10px] uppercase tracking-widest text-[#835500] font-bold mb-4">Average response: 3m</p>
               <p className="text-sm text-white/50 leading-relaxed font-sans mb-8">Chat instantly with an estate support specialist right now.</p>
               <button className="w-full py-4 text-[10px] font-bold uppercase tracking-widest bg-white text-[#022717] rounded-xl shadow-lg">Start Conversation</button>
             </div>
          </Card>

          <Card className="bg-white border-black/5 rounded-3xl p-6 ambient-shadow group hover:border-[#835500]/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#f5f3ef] flex items-center justify-center mb-6">
               <Mail className="w-5 h-5 text-[#835500]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#022717] font-serif">Email Support</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#022717]/40 font-bold mb-4">support@pawmate.com</p>
            <p className="text-sm text-[#022717]/60 leading-relaxed font-sans mt-8">For formal inquiries, technical issues, or verification appeals.</p>
          </Card>

          <Card className="bg-white border-black/5 rounded-3xl p-6 ambient-shadow group hover:border-[#835500]/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#f5f3ef] flex items-center justify-center mb-6">
               <Phone className="w-5 h-5 text-[#835500]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#022717] font-serif">Priority Line</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#022717]/40 font-bold mb-4">+1 (800) 555-PAWS</p>
            <p className="text-sm text-[#022717]/60 leading-relaxed font-sans mt-8">Exclusive 24/7 hotline for Elite Estate pass holders.</p>
          </Card>
        </div>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#022717] mb-6 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#835500]" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-black/5 rounded-3xl p-6 shadow-sm bg-white hover:bg-[#fbf9f5] transition-colors">
                <h3 className="font-serif text-xl font-bold text-[#022717] mb-3">{faq.question}</h3>
                <p className="font-sans text-sm text-[#022717]/60 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal Links */}
        <section>
           <h2 className="text-sm font-bold uppercase tracking-widest text-[#022717] mb-6 flex items-center gap-2">
             <FileText className="w-4 h-4 text-[#835500]" /> Legal Documents
           </h2>
           <Card className="bg-white border-black/5 rounded-3xl p-2 shadow-sm ambient-shadow">
             <Link href="#" className="flex items-center justify-between p-4 hover:bg-[#f5f3ef]/50 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fbf9f5] flex items-center justify-center border border-black/5">
                   <FileText className="w-4 h-4 text-[#022717]/60" />
                 </div>
                 <div className="text-left py-1">
                   <p className="text-[#022717] font-bold text-sm">Terms of Service</p>
                   <p className="text-[10px] text-[#022717]/40 uppercase tracking-widest mt-1">Last updated Oct 2026</p>
                 </div>
               </div>
               <ExternalLink className="w-4 h-4 text-[#022717]/20 group-hover:text-[#835500] transition-colors" />
             </Link>
             <div className="h-px w-full bg-black/5" />
             <Link href="#" className="flex items-center justify-between p-4 hover:bg-[#f5f3ef]/50 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fbf9f5] flex items-center justify-center border border-black/5">
                   <Shield className="w-4 h-4 text-[#022717]/60" />
                 </div>
                 <div className="text-left py-1">
                   <p className="text-[#022717] font-bold text-sm">Privacy Policy</p>
                   <p className="text-[10px] text-[#022717]/40 uppercase tracking-widest mt-1">Data handling procedures</p>
                 </div>
               </div>
               <ExternalLink className="w-4 h-4 text-[#022717]/20 group-hover:text-[#835500] transition-colors" />
             </Link>
           </Card>
        </section>

      </div>
    </div>
  )
}
