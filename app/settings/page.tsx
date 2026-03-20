'use client'

import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Shield, Key, CreditCard, LogOut, ChevronRight, AlertTriangle } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] p-6 lg:p-16 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#835500] mb-3">
            Account Preferences
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#022717] mb-4 tracking-tight">
            Settings & Security
          </h1>
          <p className="text-[#022717]/50 font-sans max-w-xl">
            Manage your digital estate preferences, security protocols, and subscription details.
          </p>
        </header>

        <div className="grid gap-8">
          {/* Notifications */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#022717] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#835500]" /> Notifications
            </h2>
            <Card className="bg-white border-black/5 rounded-3xl p-6 shadow-sm ambient-shadow space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#022717] font-bold text-base">Match Alerts</Label>
                  <p className="text-[11px] text-[#022717]/50 uppercase tracking-widest mt-1">Receive alerts when mutual interest is found</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#022717] font-bold text-base">Direct Messages</Label>
                  <p className="text-[11px] text-[#022717]/50 uppercase tracking-widest mt-1">Push notifications for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#022717] font-bold text-base">Estate Newsletter</Label>
                  <p className="text-[11px] text-[#022717]/50 uppercase tracking-widest mt-1">Weekly curation of elite profiles</p>
                </div>
                <Switch />
              </div>
            </Card>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#022717] mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#835500]" /> Privacy & Security
            </h2>
            <Card className="bg-white border-black/5 rounded-3xl p-2 shadow-sm ambient-shadow overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#f5f3ef]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fbf9f5] flex items-center justify-center border border-black/5">
                    <Key className="w-4 h-4 text-[#022717]/60" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#022717] font-bold text-sm">Change Password</p>
                    <p className="text-[10px] text-[#022717]/40 uppercase tracking-widest mt-0.5">Update your security credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#022717]/30" />
              </button>
              <div className="h-px w-full bg-black/5" />
              <div className="p-4 flex items-center justify-between hover:bg-[#f5f3ef]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fbf9f5] flex items-center justify-center border border-black/5">
                    <Shield className="w-4 h-4 text-[#022717]/60" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#022717] font-bold text-sm">Profile Visibility</p>
                    <p className="text-[10px] text-[#022717]/40 uppercase tracking-widest mt-0.5">Show profile in discovery network</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </section>

          {/* Subscription */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#022717] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#835500]" /> Subscription
            </h2>
            <Card className="bg-[#022717] border-none rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px:40px] opacity-[0.05]" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#835500]/20 border border-[#835500]/50 text-[#835500] text-[10px] font-bold uppercase tracking-widest mb-3">
                    Active Plan
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white mb-1">Elite Estate Pass</h3>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">Renews automatically</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-white text-[#022717] text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg">
                  Manage Billing
                </button>
              </div>
            </Card>
          </section>

          {/* Danger Zone */}
          <section className="mt-8">
            <Card className="bg-white border-red-500/20 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-red-600 font-bold text-base mb-1">Danger Zone</h3>
                    <p className="text-[11px] text-[#022717]/50 uppercase tracking-widest">Permanently delete your estate and companion data</p>
                  </div>
                </div>
                <button className="px-6 py-3 shrink-0 rounded-xl border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all">
                  Delete Account
                </button>
              </div>
            </Card>
          </section>

          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-3 py-6 text-[#022717]/40 hover:text-[#022717] transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out Securely</span>
          </button>
        </div>
      </div>
    </div>
  )
}
