
import React, { useState, useEffect, useRef } from 'react';
import { TacticalInput, TacticalButton, GlassCard, ScrambleText, playTacticalSound } from './SpyUI';
import { Database, Upload, Check, Loader2, FileWarning, Fingerprint, RefreshCw, Scan, History } from 'lucide-react';
import { UserProfile } from '../types';
import { extractProfileFromImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const DRAFT_KEY = 'rav_intake_draft';

const DataIntake: React.FC<Props> = ({ onComplete }) => {
  const [data, setData] = useState<Partial<UserProfile>>({
    fullName: '',
    dob: '',
    birthTime: '',
    birthLocation: ''
  });
  const [isSynced, setIsSynced] = useState(true);
  const [isRestored, setIsRestored] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.fullName || parsed.dob) {
          setData(parsed);
          setIsRestored(true);
          playTacticalSound('blip');
          const timer = setTimeout(() => setIsRestored(false), 4000);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setIsSynced(false);
    const timeout = setTimeout(() => setIsSynced(true), 800);
    return () => clearTimeout(timeout);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTacticalSound('success');
    localStorage.removeItem(DRAFT_KEY);
    onComplete(data as UserProfile);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractionError(null);
    setShowSuccess(false);
    playTacticalSound('flicker');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await extractProfileFromImage(base64, file.type);
        
        if (extracted) {
          setData(prev => ({
            ...prev,
            ...extracted,
            dob: extracted.dob?.match(/\d{4}-\d{2}-\d{2}/) ? extracted.dob : prev.dob
          }));
          setShowSuccess(true);
          playTacticalSound('success');
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setExtractionError("COULD NOT DECODE SOURCE DOCUMENT.");
        }
        setIsExtracting(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setExtractionError("UPLINK INTERRUPTED DURING SCAN.");
      setIsExtracting(false);
    }
  };

  const clearForm = () => {
    playTacticalSound('flicker');
    setData({
      fullName: '',
      dob: '',
      birthTime: '',
      birthLocation: ''
    });
    localStorage.removeItem(DRAFT_KEY);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-space-deep p-4">
       {/* Background Grid */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
       />

      <AnimatePresence>
        {isRestored && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 z-50 px-6 py-3 bg-agency-gold/10 border border-agency-gold/30 backdrop-blur-xl rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <History className="text-agency-gold animate-pulse" size={16} />
            <span className="text-[10px] font-mono text-agency-gold uppercase tracking-[0.2em]">Previous Intake Session Restored</span>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="w-full max-w-4xl z-10" title="INITIALIZE ASSET PROFILE">
        <div className="flex flex-col md:flex-row gap-10">
          
          <div className="flex-1 space-y-6">
             <div className="mb-8">
               <h2 className="text-3xl font-serif text-white mb-3 tracking-wider">
                 <ScrambleText text="SOURCE CODE INTAKE" />
               </h2>
               <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                 MISSION CRITICAL: PRECISE BIOMETRIC DATA IS REQUIRED FOR ACCURATE FIELD TRAJECTORY PROJECTION.
               </p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <TacticalInput 
                  label="Full Legal Name" 
                  value={data.fullName}
                  onChange={(e) => setData({...data, fullName: e.target.value})}
                  placeholder="ASSET FULL NAME"
                  required
                />
                <div className="grid grid-cols-2 gap-6">
                  <TacticalInput 
                    label="Date of Birth" 
                    type="date"
                    value={data.dob}
                    onChange={(e) => setData({...data, dob: e.target.value})}
                    required
                  />
                  <TacticalInput 
                    label="Time of Birth" 
                    type="time"
                    value={data.birthTime}
                    onChange={(e) => setData({...data, birthTime: e.target.value})}
                  />
                </div>
                <TacticalInput 
                  label="Place of Birth" 
                  value={data.birthLocation}
                  onChange={(e) => setData({...data, birthLocation: e.target.value})}
                  placeholder="CITY, COUNTRY OF ORIGIN"
                />

                <div className="mt-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className={`text-[9px] font-mono transition-all duration-300 flex items-center gap-2 ${isSynced ? 'text-green-500/60' : 'text-agency-gold'}`}>
                      {isSynced ? (
                        <><Check size={10} className="animate-pulse" /> LOCAL ARCHIVE SYNCED</>
                      ) : (
                        <><RefreshCw size={10} className="animate-spin" /> COMMITTING TO MEMORY...</>
                      )}
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={clearForm}
                      className="text-[9px] font-mono text-gray-500 hover:text-red-400 uppercase tracking-widest luxury-transition"
                    >
                      Purge Local Draft
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <TacticalButton type="submit" icon={<Database size={16}/>} className="flex-1">
                      COMPILE DOSSIER
                    </TacticalButton>
                  </div>
                </div>
             </form>
          </div>

          {/* Side Info Panel: Optical Intake */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-10 flex flex-col gap-8">
             <div className="text-center relative">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*,.pdf" 
                 onChange={handleFileChange}
               />
               
               <div className={`relative w-36 h-36 mx-auto mb-6 flex items-center justify-center group cursor-pointer`} onClick={handleFileClick}>
                 {/* Outer Ring */}
                 <div className={`absolute inset-0 border-2 rounded-full transition-all duration-700 ${isExtracting ? 'border-agency-gold animate-spin-slow' : 'border-agency-gold/20 group-hover:border-agency-gold/60'}`} />
                 
                 {/* Inner Content */}
                 <div className={`relative w-28 h-28 border border-white/5 rounded-full flex items-center justify-center bg-black/40 overflow-hidden`}>
                   {isExtracting ? (
                     <div className="relative w-full h-full flex items-center justify-center">
                        <Loader2 className="text-agency-gold animate-spin" size={32} />
                        {/* Scanning Line Animation */}
                        <motion.div 
                          initial={{ top: '-10%' }}
                          animate={{ top: '110%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-0.5 bg-agency-gold shadow-[0_0_10px_#D4AF37]"
                        />
                     </div>
                   ) : (
                     <Upload className={`transition-colors duration-500 ${showSuccess ? 'text-green-500' : 'text-gray-600 group-hover:text-agency-gold'}`} size={32} />
                   )}
                 </div>

                 <AnimatePresence>
                   {showSuccess && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.5 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0 }}
                       className="absolute -top-2 -right-2 bg-green-500 text-black rounded-full p-1.5 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                     >
                       <Check size={14} strokeWidth={3} />
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               
               <div className="space-y-2">
                 <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest min-h-[32px] flex items-center justify-center">
                   {isExtracting ? (
                     <ScrambleText text="DECODING OPTICAL SOURCE..." />
                   ) : showSuccess ? (
                     <span className="text-green-500">SOURCE DECODED SUCCESSFULLY</span>
                   ) : (
                     "OPTICAL SOURCE SCANNER"
                   )}
                 </p>
                 
                 {extractionError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] font-mono text-red-500 flex items-center justify-center gap-2 animate-pulse uppercase tracking-tighter"
                    >
                      <FileWarning size={12} /> {extractionError}
                    </motion.div>
                  )}
               </div>
               
               {!isExtracting && (
                 <button 
                  onClick={handleFileClick}
                  className="mt-6 w-full text-[9px] text-agency-gold/80 border border-agency-gold/20 py-3 hover:bg-agency-gold hover:text-black hover:border-agency-gold luxury-transition uppercase font-mono tracking-[0.3em] flex items-center justify-center gap-2"
                 >
                   <Scan size={14} /> UPLOAD BIRTH CERTIFICATE
                 </button>
               )}
             </div>
             
             <div className="bg-black/40 p-6 border border-white/5 rounded-sm space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <Fingerprint size={14} className="text-agency-gold" />
                 <span className="text-[9px] font-serif text-white uppercase tracking-[0.3em]">Protocol RA-9 // OCR</span>
               </div>
               <div className="space-y-2 font-mono text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
                 <p className="flex justify-between"><span>> STATUS:</span> <span className="text-green-500/60">READY</span></p>
                 <p className="flex justify-between"><span>> ENCRYPTION:</span> <span>AES-512</span></p>
                 <p className="flex justify-between"><span>> SCAN TYPE:</span> <span>H-RESOLUTION</span></p>
                 <p className="flex justify-between"><span>> SOURCE:</span> <span>LOCAL UPLOAD</span></p>
               </div>
               <div className="pt-2">
                 <p className="text-[7px] text-gray-500 italic font-sans leading-relaxed">
                   The system will attempt to extract Full Legal Name, DOB, Time, and Location. Please verify all fields after scan completion.
                 </p>
               </div>
             </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

export default DataIntake;
