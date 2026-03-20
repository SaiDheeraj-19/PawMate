'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, MessageSquare, User, Settings, HelpCircle, LogOut, Bell, Search, PawPrint } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

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
    { name: 'Discover Pets', href: '/discover', icon: Compass },
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isPublicPage = pathname === '/' || pathname === '/auth'

  if (isPublicPage) {
    return (
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 h-24 bg-transparent`}>
        <div className="container h-full max-w-[1400px] flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#1A3D2B] flex items-center gap-2">
            <PawPrint className="h-6 w-6 fill-current" />
            PawMate
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {publicNavItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-sm font-bold tracking-wider text-[#1A3D2B]/80 hover:text-[#1A3D2B] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="outline" className="px-6 py-2 rounded-full border-2 border-[#1A3D2B] text-[#1A3D2B] font-bold bg-transparent hover:bg-white/50">
                Log In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="px-6 py-2 rounded-full bg-[#1A3D2B] text-white font-bold hover:bg-[#132d20]">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // Sidebar Layout for Authenticated Pages
  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1A3D2B] flex flex-col p-8 z-40 rounded-r-[2rem] shadow-xl">
        <div className="mb-12 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-white flex flex-row items-center gap-2">
            <PawPrint className="h-6 w-6 fill-white" />
            PawMate
          </Link>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          {sidebarItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  active 
                    ? 'bg-white/10 text-white font-bold' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-white' : ''}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-6 pt-10">
          <Button className="w-full h-12 bg-[#F5A623] hover:bg-[#d8901b] text-white rounded-2xl font-bold shadow-lg">
            Find Matches
          </Button>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center overflow-hidden">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="h-5 w-5 text-[#F5A623]" />
               )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
               <span className="text-xs font-bold text-white truncate">{user?.user_metadata?.full_name || 'My Profile'}</span>
               <span className="text-[10px] text-white/50 truncate">Premium Member</span>
            </div>
            <button onClick={() => logout()} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
               <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Spacing for content */}
      <div className="pl-64" />
    </>
  )
}
