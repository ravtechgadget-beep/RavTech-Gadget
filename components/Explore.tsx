
import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, ScrambleText } from './SpyUI';
import { Map as MapIcon, Globe, Zap, ShieldCheck, Activity } from 'lucide-react';

const NODES = [
  { name: "New York", freq: "11/2", pos: { top: "35%", left: "25%" } },
  { name: "London", freq: "33/6", pos: { top: "25%", left: "48%" } },
  { name: "Dubai", freq: "22/4", pos: { top: "45%", left: "60%" } },
  { name: "Tokyo", freq: "5", pos: { top: "40%", left: "85%" } },
  { name: "Singapore", freq: "8", pos: { top: "65%", left: "75%" } },
];

export const HotspotMap: React.FC = () => (
  <div className="relative w-full aspect-[21/9] bg-black/40 rounded-3xl border border-white/5 overflow-hidden group">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--agency-gold) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
      <h3 className="text-[10px] font-serif text-white uppercase tracking-[0.4em]">Global Node Synchronicity</h3>
      <span className="text-[8px] font-mono text-agency-gold/60 uppercase tracking-widest flex items-center gap-2">
        <Activity size={10} className="animate-pulse" /> Live Energetic Mapping Active
      </span>
    </div>

    {NODES.map((node, i) => (
      <motion.div 
        key={i}
        style={{ top: node.pos.top, left: node.pos.left }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.2 }}
        className="absolute group/node"
      >
        <div className="relative">
          <div className="w-2 h-2 bg-agency-gold rounded-full shadow-[0_0_15px_#D4AF37] animate-ping absolute" />
          <div className="w-2 h-2 bg-agency-gold rounded-full relative z-10" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-agency-gold/30 px-3 py-1.5 rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-20">
             <p className="text-[8px] font-mono text-white uppercase tracking-widest mb-1">{node.name}</p>
             <p className="text-[7px] font-mono text-agency-gold/60">FREQ: {node.freq}</p>
          </div>
        </div>
      </motion.div>
    ))}

    {/* Map Scanline */}
    <motion.div 
      animate={{ left: ['-10%', '110%'] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute top-0 bottom-0 w-[1px] bg-agency-gold/20 shadow-[0_0_20px_#D4AF37]"
    />
  </div>
);
