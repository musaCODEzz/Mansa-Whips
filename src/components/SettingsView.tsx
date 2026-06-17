import React, { useState } from 'react';
import { Settings, User, Globe, DollarSign, Database, Check, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  userName: string;
  setUserName: (n: string) => void;
  currency: 'KSH' | 'USD' | 'EUR';
  setCurrency: (c: 'KSH' | 'USD' | 'EUR') => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export default function SettingsView({
  userName,
  setUserName,
  currency,
  setCurrency,
  onResetData,
  onLogout
}: SettingsViewProps) {
  const [profileName, setProfileName] = useState(userName);
  const [timezone, setTimezone] = useState('Nairobi (GMT+3)');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim()) {
      setUserName(profileName.trim());
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 2000);
    }
  };

  const conversions = {
    KSH: '1 KSH = 1.00 KSH',
    USD: '1 USD = 130 KSH (Dynamic conversion active)',
    EUR: '1 EUR = 142 KSH (Dynamic conversion active)'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none pb-12 font-mono text-xs">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl italic font-semibold text-[#F5F5F0] mb-2">Command Center Settings</h2>
        <p className="text-[#C2C2BB]/80 text-[11.5px] font-sans">
          Adjust exchange rates, customize system parameters, and coordinate administrative profiles.
        </p>
      </div>

      {showSavedMsg && (
        <div className="p-4 bg-white/[0.03] border border-white/20 text-[#F5F5F0] rounded-none flex items-center gap-3">
          <Check className="w-4 h-4 text-white" />
          <span>Profile configuration saved to browser cache successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column navigation */}
        <div className="bg-[#0B0B0C] rounded-none border border-white/10 p-2 h-fit flex flex-col gap-1 shadow-2xl">
          <button className="flex items-center gap-2.5 px-4 py-3 bg-white text-black font-semibold rounded-none text-left">
            <User className="w-3.5 h-3.5" />
            <span className="tracking-[0.15em] text-[10px]">EXECUTIVE PROFILE</span>
          </button>
          <button className="flex items-center gap-2.5 px-4 py-3 text-[#C2C2BB]/70 hover:text-white hover:bg-white/5 rounded-none text-left transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span className="tracking-[0.15em] text-[10px]">LOCALE & EXCHANGE</span>
          </button>
          <button className="flex items-center gap-2.5 px-4 py-3 text-[#C2C2BB]/70 hover:text-white hover:bg-white/5 rounded-none text-left transition-colors">
            <Database className="w-3.5 h-3.5" />
            <span className="tracking-[0.15em] text-[10px]">DATABASE CONTROLS</span>
          </button>
        </div>

        {/* Right column forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Executive profile form */}
          <section className="p-6 bg-[#0B0B0C] border border-white/10 rounded-none space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <User className="w-3.5 h-3.5 text-white/50" />
              <h3 className="font-serif italic text-sm font-semibold text-[#F5F5F0] tracking-wider">Executive Profile</h3>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="settings-username" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em]">Showroom Administrator Username</label>
                <input
                  id="settings-username"
                  name="settings-username"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settings-timezone" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em]">Showroom Location / Greet Timezone</label>
                <select
                  id="settings-timezone"
                  name="settings-timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 outline-none"
                >
                  <option value="Nairobi (GMT+3)">Nairobi, Kenya (GMT+3/EAT) • Showroom default</option>
                  <option value="London (GMT+1)">London, UK (GMT+1/BST)</option>
                  <option value="Dubai (GMT+4)">Dubai, UAE (GMT+4/GST)</option>
                  <option value="Frankfurt (GMT+2)">Frankfurt, Germany (GMT+2/CEST)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 bg-transparent border border-white/20 text-[#F5F5F0] hover:bg-white hover:text-black hover:border-transparent font-mono text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                Save Profile Configuration
              </button>
            </form>
          </section>

          {/* Currency Configuration */}
          <section className="p-6 bg-[#0B0B0C] border border-white/10 rounded-none space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-white/50" />
              <h3 className="font-serif italic text-sm font-semibold text-[#F5F5F0] tracking-wider">Currency Configuration</h3>
            </div>

            <p className="text-[#C2C2BB]/80 text-xs font-sans">
              Choose the base currency for display. KSH prices will convert dynamically based on Nairobi base rates.
            </p>

            <div className="grid grid-cols-3 gap-3 font-mono text-[10px]">
              {(['KSH', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    alert(`System display currency changed to ${curr}. Prices will adjust with current Nairobi base coefficients.`);
                  }}
                  className={`p-3 border text-center font-bold tracking-widest ${
                    currency === curr
                      ? 'bg-white text-black border-transparent'
                      : 'border-white/15 text-[#C2C2BB] hover:bg-white/5'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white/[0.01] border border-white/10 text-[10px] text-[#C2C2BB]/60 tracking-wider font-mono">
              {conversions[currency]}
            </div>
          </section>

          {/* Database System Overrides */}
          <section className="p-6 bg-[#0B0B0C] border border-white/10 rounded-none space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <Database className="w-3.5 h-3.5 text-white/50" />
              <h3 className="font-serif italic text-sm font-semibold text-[#F5F5F0] tracking-wider">System Purge controls</h3>
            </div>

            <p className="text-[#C2C2BB]/80 text-xs font-sans">
              Want to purge experimental listings and log inquiries back to their pristine factory states?
            </p>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('WARNING: This will completely flush all custom additions, edited listing data fields and manual registrations, returning Mansa Command Center to default. Continue?')) {
                  onResetData();
                }
              }}
              className="px-4 py-2.5 border border-white/15 text-white hover:bg-white/5 hover:text-red-300 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all w-full rounded-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Command Center Data
            </button>
          </section>

          {/* Security & Access Controls */}
          {onLogout && (
            <section className="p-6 bg-[#0B0B0C] border border-white/10 rounded-none space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <Globe className="w-3.5 h-3.5 text-white/50" />
                <h3 className="font-serif italic text-sm font-semibold text-[#F5F5F0] tracking-wider">Access & Security</h3>
              </div>

              <p className="text-[#C2C2BB]/80 text-xs font-sans">
                Terminate your active administrative session. This will activate the passcode gate immediately.
              </p>

              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2.5 bg-white text-black font-semibold font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all w-full rounded-none hover:bg-[#F5F5F0] border-none cursor-pointer"
              >
                Lock Command Center / Logout
              </button>
            </section>
          )}
          
        </div>
      </div>
    </div>
  );
}
