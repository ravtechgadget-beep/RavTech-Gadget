
import React from 'react';
// Import playTacticalSound to fix undefined reference error
import { ScrambleText, TacticalButton, SignalIndicator, GlassCard, playTacticalSound } from './SpyUI';
// Import Users and Map to fix undefined reference errors
import { Lock, Eye, ShieldCheck, Globe, Info, Target, Database, Cpu, Users, Map } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onUplink: () => void;
}

const LandingPage: React.FC<Props> = ({ onUplink }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // playTacticalSound is now imported
      playTacticalSound('click');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-transparent overflow-x-hidden">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-20 px-8 z-[100] flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-agency-gold flex items-center justify-center font-serif text-black font-bold rounded-sm">P</div>
          <span className="text-[10px] font-serif text-white tracking-[0.4em] uppercase hidden sm:block">Pre-Birth Archive</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          <button onClick={() => scrollToSection('mission')} className="text-[9px] font-mono text-gray-500 hover:text-agency-gold tracking-widest uppercase transition-colors">Mission</button>
          <button onClick={() => scrollToSection('archive')} className="text-[9px] font-mono text-gray-500 hover:text-agency-gold tracking-widest uppercase transition-colors">Archive</button>
          <button onClick={() => scrollToSection('intel')} className="text-[9px] font-mono text-gray-500 hover:text-agency-gold tracking-widest uppercase transition-colors">Intelligence</button>
        </nav>

        <div className="flex items-center gap-6">
          <SignalIndicator />
          <button 
            onClick={onUplink}
            className="px-6 py-2 border border-agency-gold/40 text-agency-gold text-[9px] font-mono tracking-widest uppercase hover:bg-agency-gold hover:text-black transition-all duration-300"
          >
            Access Terminal
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.8)_100%)] pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-5xl pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4 justify-center">
              <div className="w-8 h-[1px] bg-agency-gold/30"></div>
              <h2 className="text-agency-gold text-[10px] tracking-[0.6em] font-serif uppercase">Classified Access Only</h2>
              <div className="w-8 h-[1px] bg-agency-gold/30"></div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center text-center font-serif leading-tight mb-8"
          >
            <span className="text-xl md:text-3xl tracking-[0.8em] text-agency-gold-dim uppercase mb-4 opacity-70">The</span>
            <span className="text-6xl md:text-[8rem] tracking-tighter bg-gradient-to-b from-white via-agency-gold to-agency-gold-dim text-transparent bg-clip-text drop-shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
              PRE-BIRTH ARCHIVE
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="space-y-6"
          >
            <div className="text-gray-400 font-serif text-sm md:text-xl tracking-[0.3em] uppercase max-w-4xl leading-relaxed">
              The logs confirm your arrival. The archive reveals your mission. <br />
              <span className="text-white/80 italic font-mono text-xs md:text-sm tracking-widest">YOU ARE NOT AN ACCIDENT; YOU ARE A PRE-AUTHORIZED DEPLOYMENT IN AN ENCRYPTED REALITY.</span>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center">
              <TacticalButton onClick={onUplink} icon={<Lock size={18} />} className="shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                ESTABLISH UPLINK
              </TacticalButton>
              <TacticalButton variant="secondary" icon={<Globe size={18} />} onClick={() => scrollToSection('archive')}>
                EXPLORE ARCHIVE
              </TacticalButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section id="mission" className="relative py-40 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-agency-gold font-serif text-4xl tracking-widest uppercase">Operational Protocol</h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed uppercase tracking-tighter">
              The Pre-Birth Archive is a decentralized intelligence agency focused on the extraction and analysis of spiritual source code. By intersecting Numerological frequencies with Astrological alignments, we provide assets with tactical dossiers designed for high-impact mission success.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="space-y-2">
                <Target className="text-agency-gold" size={24} />
                <h4 className="text-white font-serif text-xs uppercase tracking-widest">Precision Mapping</h4>
                <p className="text-[10px] font-mono text-gray-500 uppercase">Life Path Trajectory Alignment</p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="text-agency-gold" size={24} />
                <h4 className="text-white font-serif text-xs uppercase tracking-widest">Data Integrity</h4>
                <p className="text-[10px] font-mono text-gray-500 uppercase">Source-to-Field Encryption</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-video">
            <div className="absolute inset-0 bg-agency-gold/10 border border-agency-gold/20 rounded-3xl" />
            <div className="absolute inset-10 border border-white/5 rounded-2xl flex items-center justify-center flex-col gap-4">
              <Cpu size={48} className="text-agency-gold/40 animate-pulse-slow" />
              <ScrambleText text="SCANNING REALITY..." className="text-agency-gold/60 text-[10px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ARCHIVE SECTION */}
      <section id="archive" className="relative py-40 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-agency-gold font-serif text-4xl tracking-widest uppercase">The PBA Archive</h2>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em]">Public Records for Strategic Insight</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "FOUNDING INTEL", icon: Database, desc: "Spiritual founding dates of Fortune 500 corporations." },
              { title: "OPERATIVE REGISTRY", icon: Users, desc: "Profiles of historically high-impact individual assets." },
              { title: "DESTINATION NODES", icon: Map, desc: "Energetic frequency mapping of major global city-states." }
            ].map((box, i) => (
              <GlassCard key={i} title={box.title}>
                <div className="flex flex-col items-center text-center gap-6 py-6">
                  <box.icon size={40} className="text-agency-gold/40" />
                  <p className="text-[11px] font-mono text-gray-400 uppercase leading-relaxed">{box.desc}</p>
                  <button className="text-agency-gold text-[9px] font-mono uppercase tracking-widest hover:underline" onClick={onUplink}>Access Node</button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* INTEL SECTION */}
      <section id="intel" className="relative py-40 px-6 max-w-7xl mx-auto text-center">
        <div className="space-y-12">
          <h2 className="text-white font-serif text-5xl tracking-[0.2em] uppercase max-w-4xl mx-auto leading-tight">
            Knowledge is <span className="text-agency-gold">Strategic Superiority</span>
          </h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl mx-auto">
            The devil knows your source code. If you don't, you are operating with an information deficit. Level the playing field today with the PBA.
          </p>
          <div className="pt-10">
            <TacticalButton onClick={onUplink} className="mx-auto scale-125">AUTHENTICATE IDENTITY</TacticalButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-12 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black/60">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-agency-gold flex items-center justify-center font-serif text-black font-bold text-[10px] rounded-sm">P</div>
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">© 2025 Pre-Birth Archive Intelligence. All rights reserved.</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-[8px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Privacy Protocol</a>
          <a href="#" className="text-[8px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-[8px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Contact Handler</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
