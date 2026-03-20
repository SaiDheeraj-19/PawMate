'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PawPrint, Heart, Eye, EyeOff } from 'lucide-react'
import { login, signup, loginWithGoogle } from '@/app/actions/auth'
import Link from 'next/link'
import { Toaster, toast } from 'sonner'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    if (isLogin) {
      const res = await login(formData)
      if (res?.error) toast.error(res.error)
    } else {
      const res = await signup(formData)
      if (res?.error) toast.error(res.error)
      else if (res?.success) toast.success(res.success)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
      {/* Left Pane - Forest Green */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#1A3D2B] text-white p-12 lg:p-20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <Link href="/" className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <PawPrint className="h-8 w-8 fill-white text-white" />
                <span className="font-serif text-4xl font-bold tracking-tight">PawMate</span>
              </div>
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-white/50 uppercase ml-[3.25rem]">
                The Digital Estate
              </span>
            </Link>
          </div>

          <div className="space-y-8 my-auto max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#132d20] flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-[#F5A623] fill-[#F5A623]" />
            </div>
            
            <h1 className="font-serif text-5xl lg:text-6xl leading-tight">
              A legacy of love,<br />
              <span className="text-[#F5A623] italic">managed with<br />care.</span>
            </h1>
          </div>

          <div className="max-w-sm">
            <p className="text-white/60 font-sans leading-relaxed text-lg">
              Join an exclusive community dedicated to the sophisticated management of pet wellness and lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white lg:bg-[#FAF8F4] relative">
        <div className="w-full max-w-md bg-white lg:p-12 lg:rounded-3xl lg:shadow-2xl border-black/5 relative z-10">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PawPrint className="h-8 w-8 text-[#1A3D2B] fill-[#1A3D2B]" />
              <h1 className="font-serif text-4xl font-bold text-[#1A3D2B]">PawMate</h1>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A3D2B]/40">The Digital Estate</p>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-8 border-b border-black/5 pb-4">
              <button 
                onClick={() => setIsLogin(false)}
                className={`pb-4 -mb-[17px] text-sm font-bold tracking-widest uppercase transition-all ${
                  !isLogin 
                    ? 'text-[#1A3D2B] border-b-2 border-[#1A3D2B]' 
                    : 'text-[#1A3D2B]/40 hover:text-[#1A3D2B]/70'
                }`}
              >
                Create Account
              </button>
              <button 
                onClick={() => setIsLogin(true)}
                className={`pb-4 -mb-[17px] text-sm font-bold tracking-widest uppercase transition-all ${
                  isLogin 
                    ? 'text-[#1A3D2B] border-b-2 border-[#1A3D2B]' 
                    : 'text-[#1A3D2B]/40 hover:text-[#1A3D2B]/70'
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Input 
                    name="fullName" 
                    placeholder="Full Name" 
                    required 
                    className="h-14 bg-gray-50/50 border-gray-200 rounded-2xl px-6 focus-visible:ring-[#1A3D2B] font-sans"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className="h-14 bg-gray-50/50 border-gray-200 rounded-2xl px-6 focus-visible:ring-[#1A3D2B] font-sans"
                />
              </div>
              <div className="space-y-2 relative">
                <Input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  required 
                  minLength={8}
                  className="h-14 bg-gray-50/50 border-gray-200 rounded-2xl px-6 pr-12 focus-visible:ring-[#1A3D2B] font-sans"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A3D2B]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#1A3D2B] hover:bg-[#132d20] text-white rounded-2xl font-bold tracking-wide transition-all shadow-md mt-4"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In to Estate' : 'Request Access')}
              </Button>
            </form>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or with email</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <form action={loginWithGoogle}>
              <Button 
                type="submit" 
                variant="outline" 
                className="w-full h-14 bg-white hover:bg-gray-50 text-[#1A3D2B] border-gray-200 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 shadow-sm transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </form>

            <p className="text-center text-[11px] text-gray-400 max-w-[280px] mx-auto mt-6 leading-relaxed">
              By proceeding, you agree to our <Link href="#" className="underline hover:text-[#1A3D2B]">Terms of Service</Link> and <Link href="#" className="underline hover:text-[#1A3D2B]">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
