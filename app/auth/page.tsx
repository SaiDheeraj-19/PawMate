'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { login, signup, loginWithGoogle } from '@/app/actions/auth'
import { toast } from 'sonner'
import { PawPrint, Mail, Lock, User, Chrome, ArrowRight, Eye, EyeOff, MapPin, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from 'react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  city: z.string().min(2, 'City is required'),
})

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [isPending, startTransition] = useTransition()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', city: '' },
  })

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)
    const result = await login(formData)
    if (result?.error) toast.error(result.error)
    setLoading(false)
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    setLoading(true)
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('password', values.password)
    formData.append('city', values.city)
    const result = await signup(formData)
    if (result?.error) toast.error(result.error)
    else if (result?.success) toast.success(result.success)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Column: The Digital Estate Sidebar */}
      <div className="hidden lg:flex w-2/5 bg-[#022717] p-24 flex-col justify-between relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px:40px] opacity-[0.05]" />
        
        <div className="relative z-10">
          <Link href="/" className="font-serif text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            <PawPrint className="h-8 w-8 fill-current" />
            PawMate
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40">The Digital Estate</p>
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#835500]/20 flex items-center justify-center mb-10">
            <Heart className="h-8 w-8 text-[#835500] fill-[#835500]" />
          </div>
          <h2 className="font-serif text-5xl font-bold text-white mb-10 leading-tight">
            A legacy of love, <br />
            <span className="italic font-normal text-[#835500]">managed with care.</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed font-sans">
            Join an exclusive community dedicated to the sophisticated management of pet wellness and lifestyle.
          </p>
        </div>

        <div className="relative z-10 pt-20">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 italic">
            Part of the elite companion network
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fbf9f5] lg:bg-white overflow-hidden">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-16">
            <h1 className="font-serif text-4xl font-bold text-[#022717] mb-2 flex items-center justify-center gap-2">
              <PawPrint className="h-8 w-8 fill-current" />
              PawMate
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#022717]/40">The Digital Estate</p>
          </div>

          <div className="mb-12">
            <div className="flex gap-10 border-b border-black/5 mb-12">
              <button 
                type="button"
                onClick={() => setMode('signup')}
                className={`pb-4 text-[11px] font-bold uppercase tracking-widest relative transition-all duration-300 ${mode === 'signup' ? 'text-[#022717]' : 'text-[#022717]/30 hover:text-[#022717]'}`}
              >
                Create account
                {mode === 'signup' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#022717]" />}
              </button>
              <button 
                type="button"
                onClick={() => setMode('login')}
                className={`pb-4 text-[11px] font-bold uppercase tracking-widest relative transition-all duration-300 ${mode === 'login' ? 'text-[#022717]' : 'text-[#022717]/30 hover:text-[#022717]'}`}
              >
                Sign in
                {mode === 'login' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#022717]" />}
              </button>
            </div>

            <button
              onClick={() => startTransition(() => { loginWithGoogle() })}
              type="button"
              disabled={isPending}
              className="w-full h-16 rounded-md border border-black/5 bg-white text-[#022717] flex items-center justify-center gap-4 text-sm font-bold shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>

            <div className="relative my-10 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5" />
              </div>
              <span className="relative px-6 bg-[#fbf9f5] lg:bg-white text-[9px] font-bold uppercase tracking-[0.2em] text-[#022717]/30">Or with email</span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                      <FormField control={loginForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input placeholder="Email Address" className="h-16 pl-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={loginForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input type={showPw ? 'text' : 'password'} placeholder="Password" className="h-16 pl-16 pr-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#022717]/30 hover:text-[#022717]">
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <button type="submit" disabled={loading} className="w-full h-16 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#1a3d2b] transition-all disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Sign In'}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                      <FormField control={signupForm.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input placeholder="Full Name" className="h-16 pl-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={signupForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input placeholder="Email Address" className="h-16 pl-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={signupForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input type="password" placeholder="Password" className="h-16 pl-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={signupForm.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#022717]/30" />
                              <Input placeholder="Your city" className="h-16 pl-16 rounded-md bg-[#f5f3ef]/50 border-none text-[#022717] focus:bg-white transition-all ring-inset ring-black/5 focus:ring-[#022717]/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="text-[10px] text-[#022717]/40 text-center px-4 leading-relaxed font-sans mb-8">
                        By signing up you agree to our <Link href="#" className="font-bold text-[#022717] hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-[#022717] hover:underline">Privacy Policy</Link>.
                      </div>
                      <button type="submit" disabled={loading} className="w-full h-16 rounded-md bg-[#022717] text-white text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#1a3d2b] transition-all disabled:opacity-50 z-20 relative">
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-12">
              <p className="text-[11px] font-bold tracking-widest text-[#022717]/40 uppercase">
                {mode === 'signup' ? 'Already a member?' : 'New here?'} 
                <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="ml-2 text-[#022717] hover:underline">
                  {mode === 'signup' ? 'Sign in here' : 'Create an account'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
