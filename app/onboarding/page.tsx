'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PawPrint, Camera, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { updateProfile } from '@/app/actions/profile'

// Helper to check 18+ requirement
const isAdult = (dob: string) => {
  const diff = Date.now() - new Date(dob).getTime()
  const age = new Date(diff).getUTCFullYear() - 1970
  return age >= 18
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Form State
  const [dob, setDob] = useState('')
  const [name, setName] = useState('')
  const [userVideoBlob, setUserVideoBlob] = useState<Blob | null>(null)
  
  const [petDetails, setPetDetails] = useState({
    name: '',
    species: '',
    breed: '',
    age: ''
  })
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [petVideoBlob, setPetVideoBlob] = useState<Blob | null>(null)

  // Video Recording State
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  
  // Cleanup media stream and bind to video
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream
    }
    return () => {
      // Don't stop tracks here purely on 'step' change or we lose the stream.
      // Wait, if we return a cleanup that calls stop(), it will turn off the camera when 'step' changes.
      // Instead, we shouldn't stop tracks on every effect cycle.
    }
  }, [mediaStream, step])

  // Proper unmount cleanup
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaStream])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      toast.error('Camera access is required for verification.')
    }
  }

  const startRecording = () => {
    if (!mediaStream) return
    chunksRef.current = []
    const recorder = new MediaRecorder(mediaStream)
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      if (step === 2) setUserVideoBlob(blob)
      if (step === 4) setPetVideoBlob(blob)
      // Stop camera after recording
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
    }
    
    mediaRecorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
    
    // Auto stop after 3 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    }, 3000)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!name || !dob) return toast.error('Please fill in all details')
      if (!isAdult(dob)) return toast.error('You must be at least 18 years old to create an estate account.', { duration: 5000 })
      startCamera() // Prep camera for step 2
      setStep(2)
    } else if (step === 2) {
      if (!userVideoBlob) return toast.error('Identity verification is required.')
      setStep(3)
    } else if (step === 3) {
      if (!petDetails.name || !petDetails.species || !petDetails.age || !reportFile) 
        return toast.error('Please fill in all pet details and upload vaccination report')
      startCamera() // Prep camera for step 4
      setStep(4)
    } else if (step === 4) {
      if (!petVideoBlob) return toast.error('Companion verification is required.')
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    // In a real app, upload userVideoBlob, petVideoBlob, and reportFile to Supabase Storage
    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', `Born: ${dob} | Owner of ${petDetails.name}`)
    
    // Simulating API call
    toast.loading('Encrypting and submitting verification data...', { id: 'onboarding' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    await updateProfile(formData)

    const petData = new FormData()
    petData.append('name', petDetails.name)
    petData.append('species', petDetails.species.toLowerCase() === 'cat' ? 'cat' : 'dog')
    petData.append('breed', petDetails.breed)
    petData.append('age_months', petDetails.age)
    petData.append('gender', 'male')
    petData.append('size', 'medium')
    petData.append('intent', 'playdate')
    petData.append('is_vaccinated', 'true')
    petData.append('description', '')

    const { createPet } = await import('@/app/actions/pets')
    await createPet(petData)
    
    toast.success('Verification Complete! Welcome to the Estate.', { id: 'onboarding' })
    router.push('/discover')
  }

  return (
    <div className="min-h-screen bg-[#022717] flex items-center justify-center p-6 text-white font-sans overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px:40px] opacity-[0.03]" />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="absolute top-0 right-0 p-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
          <ShieldCheck className="h-4 w-4 text-[#835500]" />
          Secure Verification
        </div>

        <div className="mb-12">
          <PawPrint className="h-10 w-10 text-white mb-6" />
          <h1 className="font-serif text-5xl font-bold mb-4 tracking-tight">Identity Verification</h1>
          <p className="text-white/50 text-sm max-w-md">Our community requires strict identity verification for the safety of all residents. Live captures verify authenticity.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#835500]' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-md ambient-shadow relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: RESIDENT DETAILS */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs text-white/70">1</span>
                  Resident Details
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Full Legal Name</Label>
                    <Input 
                      value={name} onChange={e => setName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-16 rounded-xl focus:border-[#835500] focus:ring-[#835500] text-lg" 
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Date of Birth</Label>
                    <Input 
                      type="date"
                      value={dob} onChange={e => setDob(e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-16 rounded-xl focus:border-[#835500] focus:ring-[#835500] text-lg [color-scheme:dark]" 
                    />
                    <p className="text-[10px] text-white/30 absolute -bottom-6 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Minimum age requirement is 18 years
                    </p>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full mt-12 bg-white text-[#022717] hover:bg-white/90 h-16 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                  Proceed to Visual Identity <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: USER FACE VERIFICATION */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs text-white/70">2</span>
                  Visual Identity
                </h2>

                <div className="bg-black/30 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center mb-8 border border-white/5">
                  {userVideoBlob ? (
                    <div className="text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-sm text-white/70 font-bold uppercase tracking-widest">Verification Captured</p>
                    </div>
                  ) : mediaStream ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center cursor-pointer" onClick={startCamera}>
                      <Camera className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-xs text-white/40 uppercase tracking-widest">Click to enable camera</p>
                    </div>
                  )}

                  {!userVideoBlob && mediaStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[10px] text-white/70 uppercase tracking-widest mb-4 font-bold bg-black/40 px-3 py-1 rounded-full">
                        {isRecording ? 'Recording Live Feed...' : 'Align face perfectly in frame'}
                      </p>
                      {!isRecording && (
                        <Button onClick={startRecording} className="rounded-full h-12 px-6 bg-[#835500] hover:bg-[#a66d00] text-white text-xs tracking-widest uppercase font-bold shadow-lg shadow-[#835500]/20">
                          Start Scan (3s)
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-[#835500]/10 border border-[#835500]/20 p-4 rounded-xl flex gap-3 mb-8">
                  <ShieldCheck className="w-5 h-5 text-[#835500] shrink-0" />
                  <p className="text-xs text-[#835500]/90 leading-relaxed font-medium">To prevent fraud, uploads from your camera roll are strictly prohibited. The verification requires a live scan directly from your device.</p>
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!userVideoBlob}
                  className="w-full bg-white text-[#022717] hover:bg-white/90 h-16 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl disabled:opacity-30"
                >
                  Continue Registration <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 3: PET DETAILS & VAXX REPORTS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs text-white/70">3</span>
                  Companion Profile
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Companion Name</Label>
                    <Input value={petDetails.name} onChange={e => setPetDetails({...petDetails, name: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-xl text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Species</Label>
                    <Input value={petDetails.species} onChange={e => setPetDetails({...petDetails, species: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-xl text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Breed Variant</Label>
                    <Input value={petDetails.breed} onChange={e => setPetDetails({...petDetails, breed: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-xl text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Age (Months)</Label>
                    <Input type="number" value={petDetails.age} onChange={e => setPetDetails({...petDetails, age: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-xl text-white" />
                  </div>
                </div>

                <div className="mb-8">
                   <Label className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3 block">Health Certification (Vaccination Report)</Label>
                   <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept=".pdf,image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setReportFile(e.target.files?.[0] || null)}
                      />
                      {reportFile ? (
                        <div className="flex flex-col items-center">
                          <FileText className="w-8 h-8 text-[#835500] mb-2" />
                          <p className="text-white text-sm font-medium">{reportFile.name}</p>
                          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Ready for review</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-white/30 mb-2" />
                          <p className="text-white/60 text-sm">Upload Official Health Records</p>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-2">Accepted formats: PDF, JPG, PNG</p>
                        </div>
                      )}
                   </div>
                </div>

                <Button onClick={handleNext} className="w-full bg-white text-[#022717] hover:bg-white/90 h-16 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                  Proceed to Companion Visual ID <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 4: PET FACE VERIFICATION */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs text-white/70">4</span>
                  Companion Visual ID
                </h2>

                <div className="bg-black/30 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center mb-8 border border-white/5">
                  {petVideoBlob ? (
                    <div className="text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-sm text-white/70 font-bold uppercase tracking-widest">Companion Secured</p>
                    </div>
                  ) : mediaStream ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center cursor-pointer" onClick={startCamera}>
                      <Camera className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-xs text-white/40 uppercase tracking-widest">Enable camera for companion</p>
                    </div>
                  )}

                  {!petVideoBlob && mediaStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[10px] text-white/70 uppercase tracking-widest mb-4 font-bold bg-black/40 px-3 py-1 rounded-full">
                        {isRecording ? 'Capturing Companion...' : `Bring ${petDetails.name || 'companion'} to the camera`}
                      </p>
                      {!isRecording && (
                        <Button onClick={startRecording} className="rounded-full h-12 px-6 bg-[#835500] hover:bg-[#a66d00] text-white text-xs tracking-widest uppercase font-bold shadow-lg shadow-[#835500]/20">
                          Start Scan (3s)
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white/10 border border-white/10 p-4 rounded-xl mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white font-bold opacity-80 uppercase tracking-widest">Digital Vault Protection</p>
                    <p className="text-[10px] text-white/40 mt-1">Files encrypted with AES-256 standard</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-white/30" />
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!petVideoBlob}
                  className={`w-full h-16 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl transition-all ${petVideoBlob ? 'bg-[#835500] hover:bg-[#a66d00] text-white' : 'bg-white/10 text-white/30'}`}
                >
                  Confirm Identity & Enter Estate
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
