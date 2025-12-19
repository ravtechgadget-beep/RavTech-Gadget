
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Activity, Mic, ShieldAlert, Users } from 'lucide-react';
import { CircleMember } from '../types';

// --- TACTICAL SOUND ENGINE ---
export const playTacticalSound = (type: 'click' | 'blip' | 'flicker' | 'success') => {
  try {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'blip':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'flicker':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, now);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.setValueAtTime(0.03, now + 0.02);
        gain.gain.setValueAtTime(0.01, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  } catch (e) {}
};

// --- SIGNAL INDICATOR ---
export const SignalIndicator: React.FC = () => {
  const [strength, setStrength] = useState(85);
  useEffect(() => {
    const interval = setInterval(() => {
      setStrength(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(70, Math.min(100, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 group cursor-help">
      <div className="flex gap-0.5 items-end h-3">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              height: `${(i * 25) <= strength ? i * 25 : 10}%`,
              opacity: (i * 25) <= strength ? 1 : 0.2
            }}
            className="w-1 bg-agency-gold rounded-t-[1px]"
          />
        ))}
      </div>
      <span className="text-[8px] font-mono text-agency-gold/60 uppercase tracking-widest">{strength}% SIGNAL</span>
    </div>
  );
};

// --- OSCILLOSCOPE ---
export const Oscilloscope: React.FC<{ active: boolean; className?: string }> = ({ active, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#D4AF37';

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.05 + offset) * (active ? 15 : 2) * Math.sin(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      offset += active ? 0.2 : 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return <canvas ref={canvasRef} width={200} height={60} className={className} />;
};

// --- WAVEFORM VISUALIZER ---
export const WaveformVisualizer: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 w-full px-4">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          animate={active ? { 
            height: [8, Math.random() * 40 + 8, 8],
            opacity: [0.3, 1, 0.3]
          } : { height: 8, opacity: 0.1 }}
          transition={{ 
            duration: 0.5 + Math.random() * 0.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-1.5 bg-agency-gold rounded-full shadow-[0_0_10px_#D4AF37]"
        />
      ))}
    </div>
  );
};

// --- TACTICAL PROGRESS BAR ---
export const TacticalProgressBar: React.FC<{ progress: number; label: string }> = ({ progress, label }) => (
  <div className="w-full space-y-2">
    <div className="flex justify-between items-center text-[8px] font-mono text-agency-gold/60 uppercase tracking-widest">
      <span>{label}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-agency-gold shadow-[0_0_15px_#D4AF37]"
      />
    </div>
  </div>
);

// --- STARFIELD BACKGROUND ---
export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const stars: { x: number; y: number; z: number; o: number }[] = [];
    for (let i = 0; i < 250; i++) {
      stars.push({ x: Math.random() * width, y: Math.random() * height, z: Math.random() * 2, o: Math.random() * 0.8 });
    }
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 175, 55, ${star.o})`;
        ctx.arc(star.x, star.y, Math.max(0.3, 1.2 - star.z * 0.4), 0, Math.PI * 2);
        ctx.fill();
        star.y += 0.15 * star.z;
        if (star.y > height) { star.y = 0; star.x = Math.random() * width; }
      });
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40 pointer-events-none" />;
};

// --- MATRIX RAIN ---
export const MatrixRain: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = canvas.parentElement?.clientHeight || 300;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%!&*()";
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#D4AF37";
      ctx.font = fontSize + "px JetBrains Mono";
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className={`opacity-10 pointer-events-none ${className}`} />;
};

// --- LIVE AUDIO VISUALIZER ---
export const LiveAudioVisualizer: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-6 w-20">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={active ? { 
            height: [4, Math.random() * 20 + 4, 4],
            opacity: [0.3, 1, 0.3]
          } : { height: 4, opacity: 0.1 }}
          transition={{ 
            duration: 0.4 + Math.random() * 0.4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-1 bg-agency-gold rounded-full"
        />
      ))}
    </div>
  );
};

// --- NETWORK WEB ---
export const NetworkWeb: React.FC<{ members: CircleMember[], userName: string }> = ({ members, userName }) => {
  const size = 500;
  const center = size / 2;
  const radius = 150;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto overflow-visible">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
        {/* Connection Lines */}
        {members.map((m, i) => {
          const angle = (i / members.length) * Math.PI * 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const sync = m.compatibility || 50;
          return (
            <motion.line
              key={`line-${m.id}`}
              x1={center} y1={center} x2={x} y2={y}
              stroke="rgba(212,175,55,0.2)"
              strokeWidth={sync / 25}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Outer Members */}
        {members.map((m, i) => {
          const angle = (i / members.length) * Math.PI * 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <motion.g
              key={`node-${m.id}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <circle cx={x} cy={y} r="25" fill="#0a0a0f" stroke="#D4AF37" strokeWidth="1" />
              <text x={x} y={y} fill="#D4AF37" fontSize="10" textAnchor="middle" dy=".3em" fontFamily="Cinzel">
                {m.name.charAt(0)}
              </text>
              <text x={x} y={y + 40} fill="rgba(212,175,55,0.6)" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono" className="uppercase">
                {m.name.split(' ')[0]}
              </text>
            </motion.g>
          );
        })}

        {/* Center Node (User) */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <circle cx={center} cy={center} r="40" fill="#D4AF37" />
          <text x={center} y={center} fill="black" fontSize="16" fontWeight="bold" textAnchor="middle" dy=".3em" fontFamily="Cinzel">
            {userName.charAt(0)}
          </text>
          <circle cx={center} cy={center} r="45" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 5">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${center} ${center}`} to={`360 ${center} ${center}`} dur="10s" repeatCount="indefinite" />
          </circle>
        </motion.g>
      </svg>
    </div>
  );
};

// --- TRAJECTORY BAR CHART ---
export const TrajectoryBarChart: React.FC<{ data: { month: string, freq: number, directive: string }[] }> = ({ data }) => {
  if (data.length === 0) return <div className="text-center text-[10px] font-mono text-gray-600 uppercase">Awaiting cycle data...</div>;

  return (
    <div className="flex items-end justify-between h-48 gap-2 pt-10">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${d.freq}%` }}
            transition={{ duration: 1, delay: i * 0.05 }}
            className="w-full bg-agency-gold/20 border-t-2 border-agency-gold group-hover:bg-agency-gold/40 transition-colors relative"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-mono text-agency-gold">
              {d.directive}
            </div>
          </motion.div>
          <span className="text-[7px] font-mono text-gray-500 uppercase rotate-45 mt-2 origin-left">{d.month.substring(0, 3)}</span>
        </div>
      ))}
    </div>
  );
};

// --- SCRAMBLE TEXT EFFECT ---
export const ScrambleText: React.FC<{ text: string; className?: string; reveal?: boolean; gradient?: boolean }> = ({ text, className, reveal = true, gradient = false }) => {
  const [display, setDisplay] = useState('');
  const chars = "ABCDEFGHIJKLMOPQRSTUVWXYZ0123456789!@#$%&*?/_+=-";
  useEffect(() => {
    if (!reveal) return;
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        if (letter === " ") return " ";
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 35);
    return () => clearInterval(interval);
  }, [text, reveal]);
  const baseClass = gradient ? "bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-400 text-transparent bg-clip-text font-serif" : "font-mono";
  return <span className={`${baseClass} ${className}`}>{display}</span>;
};

// --- GLASS CARD ---
export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode }> = ({ children, className = '', title, icon }) => (
  <div className={`relative backdrop-blur-xl bg-slate-900/40 border border-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-agency-gold/20 hover:shadow-agency-gold/5 ${className}`}>
     <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-agency-gold/40" />
     <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-agency-gold/40" />
     <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-agency-gold/40" />
     <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-agency-gold/40" />
     {title && (
       <div className="mb-6 border-b border-white/5 pb-3 flex justify-between items-center">
         <h3 className="font-serif text-agency-gold/80 tracking-[0.3em] text-[10px] uppercase flex items-center gap-3">
           {icon || <span className="w-1.5 h-1.5 bg-agency-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)] animate-pulse"></span>}
           {title}
         </h3>
         <div className="h-[1px] flex-1 bg-white/5 mx-4 hidden sm:block"></div>
       </div>
     )}
     <div className="relative z-10">{children}</div>
  </div>
);

// --- METRIC CARD ---
export const MetricCard: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; color?: string }> = ({ label, value, icon, color = "bg-agency-gold" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="relative p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden group luxury-transition hover:border-agency-gold/30"
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${color} opacity-40 group-hover:opacity-100 luxury-transition`} />
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{label}</span>
        <h4 className="text-3xl font-serif text-white tracking-tighter">{value}</h4>
      </div>
      {icon && <div className="text-agency-gold/40 group-hover:text-agency-gold luxury-transition">{icon}</div>}
    </div>
  </motion.div>
);

// --- TACTICAL BUTTON ---
export const TacticalButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger'; icon?: React.ReactNode }> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const baseStyles = "relative px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.3em] luxury-transition group overflow-hidden flex items-center justify-center gap-3 shadow-lg rounded-sm";
  const variants = {
    primary: "bg-agency-gold text-black hover:bg-white hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95",
    secondary: "border border-white/10 text-gray-400 hover:border-agency-gold hover:text-white backdrop-blur-md bg-white/5 hover:scale-[1.02] active:scale-95",
    danger: "border border-red-900/40 text-red-500 hover:bg-red-900/20 hover:text-red-400 active:scale-95"
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// --- TACTICAL TERMINAL ---
export const TacticalTerminal: React.FC<{ prompt: string; onCommand: (cmd: string) => void; output: string[]; loading?: boolean }> = ({ prompt, onCommand, output, loading }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [output, loading]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onCommand(input);
    setInput('');
  };
  return (
    <div className="flex flex-col h-full bg-black/60 border border-white/5 font-mono text-xs overflow-hidden">
      <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between">
        <span className="text-[8px] tracking-widest text-agency-gold/60 uppercase">System Console // RA-9 Uplink</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
        {output.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-agency-gold/40 select-none">[{i+1}]</span>
            <span className="text-gray-400 leading-relaxed whitespace-pre-wrap">{line}</span>
          </div>
        ))}
        {loading && <div className="animate-pulse text-agency-gold px-10 py-4 border border-agency-gold/20 bg-agency-gold/5 rounded-sm">Executing Intelligence Protocol...</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-white/[0.02] flex gap-3">
        <span className="text-agency-gold">{prompt}</span>
        <input 
          autoFocus 
          className="flex-1 bg-transparent border-none outline-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Command (SCAN, STATUS, DECRYPT)..."
        />
      </form>
    </div>
  );
};

// --- RADAR VISUAL ---
export const RadarVisual: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  return (
    <div className="flex items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        {[0.2, 0.4, 0.6, 0.8, 1].map((lvl, i) => (
          <circle key={i} cx={center} cy={center} r={radius * lvl} fill="none" stroke="rgba(212,175,55,0.1)" strokeDasharray="2,2" />
        ))}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="rgba(212,175,55,0.1)" />;
        })}
        <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2 }} d={path} fill="rgba(212,175,55,0.15)" stroke="#D4AF37" strokeWidth="1.5" />
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          const lx = center + (radius + 20) * Math.cos(angle);
          const ly = center + (radius + 20) * Math.sin(angle);
          return (
            <text key={i} x={lx} y={ly} fill="rgba(212,175,55,0.6)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" alignmentBaseline="middle" className="uppercase tracking-widest">
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// --- COMPATIBILITY GAUGE ---
export const CompatibilityGauge: React.FC<{ score: number, label?: string }> = ({ score, label = "Sync Level" }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg className="w-48 h-48 rotate-[-90deg]">
        <circle cx="96" cy="96" r={radius} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="12" />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A711F" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-mono text-white tracking-tighter">{score.toFixed(1)}%</span>
        <span className="text-[9px] font-mono text-agency-gold/60 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};

// --- CYBER LINE CHART ---
export const CyberLineChart: React.FC<{ data: number[], label: string }> = ({ data, label }) => {
  const width = 400;
  const height = 150;
  const max = Math.max(...data, 10);
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (val / max) * height
  }));
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[8px] font-mono text-agency-gold/40 uppercase tracking-widest">
        <span>{label} Pulse</span>
        <span>Peak: {max}%</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </linearGradient>
        </defs>
        <path d={`${path} L ${width},${height} L 0,${height} Z`} fill="url(#lineGradient)" />
        <motion.path
          d={path}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0a0a0f" stroke="#D4AF37" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
};

// --- HOLOGRAPHIC DISPLAY ---
export const HolographicDisplay: React.FC<{ src: string | null, loading?: boolean }> = ({ src, loading }) => (
  <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-agency-gold/20 border-t-agency-gold rounded-full animate-spin" />
          <ScrambleText text="SYNTHESIZING ASSET PORTRAIT..." className="text-[10px] text-agency-gold/60" />
        </motion.div>
      ) : src ? (
        <motion.div 
          key="image"
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          className="w-full h-full relative"
        >
          <img src={src} alt="Asset Portrait" className="w-full h-full object-cover grayscale opacity-80" />
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-agency-gold/10 to-transparent h-20 animate-scanline pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.4)_100%)] pointer-events-none" />
          <div className="absolute bottom-4 left-4 border-l-2 border-agency-gold pl-3">
             <span className="block text-[10px] font-mono text-agency-gold uppercase tracking-[0.2em]">Asset Identified</span>
             <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest">Classified Visualization</span>
          </div>
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
          <Fingerprint size={80} className="text-white mb-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">No Visual Intel</span>
        </div>
      )}
    </AnimatePresence>
  </div>
);

// --- TACTICAL INPUT ---
export const TacticalInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="flex flex-col gap-2 mb-5 group">
    <label className="text-[9px] uppercase font-serif tracking-[0.4em] text-agency-gold/60 group-focus-within:text-agency-gold luxury-transition">{label}</label>
    <input className="bg-white/5 border border-white/10 text-white font-mono text-sm p-3.5 luxury-transition focus:border-agency-gold/60 focus:outline-none focus:bg-white/10 placeholder-white/10 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] focus:ring-1 focus:ring-agency-gold/20" {...props} />
  </div>
);

// --- TACTICAL TOOLTIP ---
export const TacticalTooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const handleMouseMove = (e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} onMouseMove={handleMouseMove}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'fixed', left: mousePos.x + 15, top: mousePos.y + 15, zIndex: 9999, pointerEvents: 'none' }} className="px-4 py-2 bg-space-deep/95 border border-agency-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-agency-gold/60" />
            <span className="text-[10px] font-mono text-agency-gold uppercase tracking-[0.15em] whitespace-nowrap">{content}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
