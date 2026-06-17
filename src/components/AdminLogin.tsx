import React, { useState } from 'react';
import { Shield, KeyRound, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate luxury secure response delay (500ms)
    setTimeout(() => {
      if (passcode === 'mansa2026') {
        onSuccess();
      } else {
        setError('ACCESS DENIED: INVALID PASSCODE CREDENTIALS.');
        setPasscode('');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
      
      {/* Background radial luxury ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-[#0B0B0C] border border-white/10 p-8 space-y-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-12 h-12 mx-auto rounded-none bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-[0.25em] text-[#F5F5F0]">
              MANSA COMMAND
            </h1>
            <p className="text-[8.5px] font-mono tracking-[0.3em] uppercase text-white/30 mt-1 flex items-center justify-center gap-1">
              Protected Entrance
              <Sparkles className="w-2.5 h-2.5 text-white/20 animate-pulse" />
            </p>
          </div>
        </div>

        {/* Error Warning Indicator */}
        {error && (
          <div className="bg-[#b21c24]/10 border border-[#b21c24]/20 p-4 animate-in shake duration-200">
            <p className="font-mono text-[9.5px] text-[#b21c24] font-bold uppercase tracking-wider text-center">
              {error}
            </p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left font-mono text-xs">
            <label htmlFor="admin-passcode" className="text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/50 font-bold block">
              Enter Administrative Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                id="admin-passcode"
                name="admin-passcode"
                type={showPasscode ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.01] border border-white/10 focus:border-white/35 text-white pl-11 pr-11 py-3 font-mono text-sm tracking-widest focus:ring-0 rounded-none h-12 outline-none transition-colors"
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors border-none bg-transparent cursor-pointer outline-none"
                tabIndex={-1}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full bg-white text-black font-semibold font-mono py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#F5F5F0] transition-colors disabled:opacity-40 disabled:hover:bg-white active:scale-[0.98] outline-none border-none cursor-pointer flex items-center justify-center h-12"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Authorizing Security...</span>
              ) : (
                'Unlock Registry Access'
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-transparent text-[#C2C2BB]/60 hover:text-white hover:bg-white/[0.02] border border-white/10 font-mono py-3 text-[9.5px] uppercase tracking-[0.2em] transition-all outline-none cursor-pointer flex items-center justify-center gap-1.5 h-11"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to public site
            </button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[8.5px] font-mono text-[#C2C2BB]/20 uppercase tracking-[0.15em] leading-relaxed">
            Authorized personnel only. All access connections are logged in browser sessionStorage.
          </p>
        </div>

      </div>
    </div>
  );
}
