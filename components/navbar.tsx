'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, MessageSquare, User, Settings, HelpCircle, LogOut, Bell, Search, PawPrint } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const publicNavItems = [
    { name: 'Discover', href: '/discover' },
    { name: 'Matches', href: '/matches' },
    { name: 'Messages', href: '/messages' },
  ]

  const sidebarItems = [
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const bottomSidebarItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ]

  const isAuthPage = pathname === '/auth'
  const isOnboardingPage = pathname === '/onboarding'
  const isPublicPage = pathname === '/'

  if (isAuthPage || isOnboardingPage) {
    return null; // Both login and secure onboarding manage their own layouts without sidebars
  }

  if (isPublicPage) {
    return (
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl h-16 bg-white/80 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#022717] flex items-center gap-2">
            <PawPrint className="h-5 w-5 fill-current" />
            PawMate
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {publicNavItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022717]/60 hover:text-[#022717] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Bell className="h-5 w-5 text-[#022717]/40 cursor-pointer" />
            <Search className="h-5 w-5 text-[#022717]/40 cursor-pointer" />
            {user ? (
              <Link href="/profile" className="w-10 h-10 rounded-full bg-[#f5f3ef] border border-black/5 flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-[#022717]/60" />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-6 py-2 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-wider"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    )
  }

  // Sidebar Layout for Authenticated Pages
  return (
    <>
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#fbf9f5] flex flex-col p-8 z-40">
        <div className="mb-20">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#022717] flex flex-row items-center gap-2 mb-1">
            <PawPrint className="h-6 w-6 fill-current" />
            PawMate
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#022717]/40">The Digital Estate</span>
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          {sidebarItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  active 
                    ? 'bg-[#ffffff] text-[#022717] ambient-shadow font-bold' 
                    : 'text-[#022717]/50 hover:text-[#022717]'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-[#022717]' : ''}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-10">
          {bottomSidebarItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#022717]/50 hover:text-[#022717] transition-all"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-all text-left mt-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacing for content */}
      <div className="pl-64" />
    </>
  )
}
