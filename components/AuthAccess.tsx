
import React, { useState, useEffect } from 'react';
import { TacticalInput, TacticalButton, GlassCard, ScrambleText } from './SpyUI';
import { ShieldCheck, ArrowRight, History } from 'lucide-react';

interface Props {
  onAuthenticated: () => void;
}

const EMAIL_KEY = 'rav_auth_email';

const AuthAccess: React.FC<Props> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRestored(true);
      // Fade out indicator after a few seconds
      const timer = setTimeout(() => setIsRestored(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Persist email as user types
  useEffect(() => {
    if (email) {
      localStorage.setItem(EMAIL_KEY, email);
    }
  }, [email]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onAuthenticated();
    }, 1500);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      
      <GlassCard className="w-full max-w-md z-10 mx-4" title="IDENTIFICATION REQUIRED">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="text-center mb-6">
            <ShieldCheck className="w-12 h-12 text-agency-gold mx-auto mb-4 animate-pulse-slow" />
            <p className="font-mono text-xs text-gray-400">ENTER CREDENTIALS TO ACCESS MAINFRAME</p>
          </div>

          <div className="relative">
            <TacticalInput 
              label="Agent ID (Email)" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@rav.house"
              required
            />
            {isRestored && (
              <div className="absolute top-0 right-0 flex items-center gap-1 text-[8px] text-agency-gold/40 font-mono uppercase tracking-tighter animate-pulse">
                <History size={10} /> Restored
              </div>
            )}
          </div>
          
          <TacticalInput 
            label="Access Code" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="h-4" />

          <TacticalButton type="submit" disabled={loading} icon={!loading ? <ArrowRight size={16} /> : undefined} className="w-full">
            {loading ? <ScrambleText text="VERIFYING..." /> : "ACCESS TERMINAL"}
          </TacticalButton>

          <div className="text-center mt-4">
            <span className="text-[10px] text-gray-600 font-mono">UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE</span>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AuthAccess;
