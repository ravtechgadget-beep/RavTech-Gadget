
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { ScrambleText, playTacticalSound } from './SpyUI';
import { ShieldCheck, Database, Fingerprint, Globe, Cpu, Loader2 } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onComplete: () => void;
}

const CinematicInitiation: React.FC<Props> = ({ profile, onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "ESTABLISHING SECURE UPLINK...", icon: Globe },
    { text: "DECRYPTING SOURCE CODE ARCHIVE...", icon: Database },
    { text: "EXTRACTING SPIRITUAL BIOMETRICS...", icon: Fingerprint },
    { text: "SYNCHRONIZING TACTICAL TRAJECTORY...", icon: Cpu },
    { text: "ASSET AUTHORIZED. CLEARANCE OMEGA.", icon: ShieldCheck },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          playTacticalSound('blip');
          return prev + 1;
        }
        clearInterval(timer);
        setTimeout(onComplete, 2000);
        return prev;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full space-y-16">
        
        {/* Animated Scanner Ring */}
        <div className="relative w-48 h-48 mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-agency-gold/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-agency-gold/10 border-dashed rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <AnimatePresence mode="wait">
               <motion.div 
                 key={step}
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 1.5, opacity: 0 }}
                 className="text-agency-gold"
               >
                 {React.createElement(steps[step].icon, { size: 48 })}
               </motion.div>
             </AnimatePresence>
          </div>
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-[1px] bg-agency-gold shadow-[0_0_15px_#D4AF37] opacity-50"
          />
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-agency-gold font-mono text-xs tracking-[0.4em] uppercase"
              >
                <ScrambleText text={steps[step].text} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ 
                  scale: i === step ? 1.2 : 1,
                  backgroundColor: i <= step ? '#D4AF37' : 'rgba(212,175,55,0.1)'
                }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
           <div className="text-left space-y-1">
             <p className="text-gray-400">Target Identity:</p>
             <p className="text-white">{profile.fullName}</p>
           </div>
           <div className="text-right space-y-1">
             <p className="text-gray-400">Source Chronology:</p>
             <p className="text-white">{profile.dob}</p>
           </div>
        </div>
      </div>
      
      {/* Initiation Overlay */}
      {step === steps.length - 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none bg-white/5 backdrop-invert"
        />
      )}
    </div>
  );
};

export default CinematicInitiation;
