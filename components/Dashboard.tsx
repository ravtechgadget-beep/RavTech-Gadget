
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, TacticalLog, CircleMember, TacticalMission } from '../types';
import { 
  GlassCard, 
  ScrambleText, 
  TacticalButton, 
  playTacticalSound, 
  TacticalTooltip, 
  TacticalTerminal, 
  RadarVisual,
  SignalIndicator,
  CompatibilityGauge,
  TacticalInput,
  MetricCard,
  CyberLineChart,
  HolographicDisplay,
  LiveAudioVisualizer,
  MatrixRain,
  NetworkWeb,
  TrajectoryBarChart,
  TacticalProgressBar,
  WaveformVisualizer,
  Oscilloscope
} from './SpyUI';
import { HotspotMap } from './Explore';
import { 
  generateBriefing, 
  generateStrategicDirective,
  generateShadowDirective,
  generateAssetPortrait,
  chatWithHandler, 
  analyzeLog, 
  textToSpeech, 
  analyzeZodiac, 
  analyzeWealthForecast, 
  analyzeSourceMatrix,
  analyzeCompatibility,
  fetchFoundingIntel,
  fetchMetaphysicalToolIntel,
  fetchDailyFrequency,
  executeTerminalCommand,
  searchLocationIntel,
  connectToHandlerLive,
  analyzeYearlyCycle,
  generateAssetVideo,
  generateMissions
} from '../services/geminiService';
import { 
  Activity, 
  ShieldAlert, 
  MessageSquare, 
  Send,
  Lock,
  FileText,
  Globe,
  ChevronRight,
  X,
  Fingerprint,
  Loader2,
  ShieldCheck,
  UserCheck,
  Search,
  Dna,
  Archive,
  Compass,
  Trophy,
  Plus,
  Users,
  Compass as DatabaseIcon,
  Calendar as LucideCalendar,
  Volume2,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers,
  UserMinus,
  Map as MapIcon,
  Mic,
  Camera,
  Image as ImageIcon,
  Home,
  Music,
  Car,
  Calculator,
  Briefcase,
  Moon,
  Zap,
  Grid,
  Command,
  Settings,
  LayoutGrid,
  MessageCircle,
  Headphones,
  FileSearch,
  CheckCircle2,
  Timer,
  Network,
  Video,
  AlertCircle,
  Terminal,
  Target,
  Skull,
  Trash2,
  ShieldHalf,
  Info
} from 'lucide-react';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';

const ProgressiveReveal: React.FC<{ content: string }> = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="prose prose-invert prose-agency max-w-none"
    >
      <ReactMarkdown
        components={{
          p: ({ ...props }) => <p className="mb-6 text-sm md:text-base leading-relaxed text-gray-300 font-mono uppercase tracking-tight" {...props} />,
          h1: ({ ...props }) => <h1 className="text-xl md:text-2xl font-serif text-agency-gold mb-8 mt-12 tracking-[0.2em] border-b border-agency-gold/20 pb-4 uppercase" {...props} />,
          h2: ({ ...props }) => <h2 className="text-lg md:text-xl font-serif text-agency-gold/80 mb-6 mt-10 tracking-widest uppercase" {...props} />,
          li: ({ ...props }) => <li className="mb-3 text-sm md:text-base font-mono text-gray-400 list-none flex gap-4 before:content-['>'] before:text-agency-gold/60" {...props} />,
          strong: ({ ...props }) => <strong className="text-agency-gold font-bold" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

interface Props {
  profile: UserProfile;
  onLogout: () => void;
}

type TabType = 'LAUNCHER' | 'DOSSIER' | 'NETWORK' | 'EXPLORE' | 'CALENDAR' | 'OPS' | 'SETTINGS';

const LAUNCHER_TOOLS = [
  { id: 'wealth', label: 'Wealth Vector', icon: TrendingUp, color: 'bg-green-700' },
  { id: 'matrix', label: 'Source Matrix', icon: Cpu, color: 'bg-blue-900' },
  { id: 'yearly', label: 'Yearly Forecast', icon: LucideCalendar, color: 'bg-purple-600' },
  { id: 'places', label: 'Places to Live', icon: Home, color: 'bg-green-600' },
  { id: 'travel', label: 'Travel Destinations', icon: MapIcon, color: 'bg-blue-400' },
  { id: 'music', label: 'Music & Artists', icon: Music, color: 'bg-orange-600' },
  { id: 'cars', label: 'Cars', icon: Car, color: 'bg-gray-600' },
  { id: 'lucky', label: 'Lucky Number', icon: Trophy, color: 'bg-yellow-600' },
  { id: 'letter', label: 'Letterology', icon: FileText, color: 'bg-pink-600' },
  { id: 'pricing', label: 'Pricing Calculator', icon: Calculator, color: 'bg-blue-600' },
  { id: 'matrix-num', label: 'Matrix Numbers', icon: Dna, color: 'bg-red-700' },
  { id: 'home', label: 'Home Picker', icon: Home, color: 'bg-green-700' },
  { id: 'career', label: 'Career Consultant', icon: Briefcase, color: 'bg-gray-800' },
  { id: 'dream', label: 'Dream Interpreter', icon: Moon, color: 'bg-purple-800' },
  { id: 'energy', label: 'Energy Insight', icon: Zap, color: 'bg-red-500' },
];

const Dashboard: React.FC<Props> = ({ profile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('LAUNCHER');
  const [briefing, setBriefing] = useState<string | null>(null);
  const [directive, setDirective] = useState<string | null>(null);
  const [shadowDirective, setShadowDirective] = useState<string | null>(null);
  const [portrait, setPortrait] = useState<string | null>(() => localStorage.getItem(`rav_portrait_${profile.id}`));
  const [assetVideo, setAssetVideo] = useState<string | null>(() => localStorage.getItem(`rav_video_${profile.id}`));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [loadingDirective, setLoadingDirective] = useState(false);
  const [loadingShadow, setLoadingShadow] = useState(false);
  const [loadingPortrait, setLoadingPortrait] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [intelResult, setIntelResult] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolIntel, setToolIntel] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState(false);

  // Persistence for Compatibility Form
  const [compTargetName, setCompTargetName] = useState('');
  const [compTargetDob, setCompTargetDob] = useState('');
  const [compResult, setCompResult] = useState<{ score: number, summary: string } | null>(null);
  const [loadingComp, setLoadingComp] = useState(false);
  
  // Dynamic Network State
  const [allies, setAllies] = useState<CircleMember[]>(() => {
    const saved = localStorage.getItem(`rav_allies_${profile.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Explore Search State
  const [exploreSearchInput, setExploreSearchInput] = useState('');

  // Ops View Terminal State
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["SYSTEM READY. WELCOME AGENT.", "TYPE 'HELP' FOR DIRECTIVES."]);
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [missions, setMissions] = useState<TacticalMission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [fieldReports, setFieldReports] = useState<TacticalLog[]>(() => {
    const saved = localStorage.getItem(`rav_reports_${profile.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [reportInput, setReportInput] = useState('');
  const [analyzingReport, setAnalyzingReport] = useState(false);

  // Live Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`rav_allies_${profile.id}`, JSON.stringify(allies));
  }, [allies, profile.id]);

  useEffect(() => {
    localStorage.setItem(`rav_reports_${profile.id}`, JSON.stringify(fieldReports));
  }, [fieldReports, profile.id]);

  useEffect(() => {
    const savedChat = localStorage.getItem(`chat_history_${profile.id}`);
    if (savedChat) {
      try { setChatHistory(JSON.parse(savedChat)); } catch (e) {}
    }
  }, [profile.id]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(`chat_history_${profile.id}`, JSON.stringify(chatHistory.slice(-50)));
    }
  }, [chatHistory, profile.id]);

  // Daily Frequency Refresher
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyIntel, setDailyIntel] = useState<string | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [yearlyData, setYearlyData] = useState<{ month: string, freq: number, directive: string }[]>([]);
  const [loadingYearly, setLoadingYearly] = useState(false);

  const calculateLifePath = (dob: string) => {
    if (!dob) return 0;
    const digits = dob.replace(/\D/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  };

  const lifePath = calculateLifePath(profile.dob);
  const earthZodiac = (new Date(profile.dob).getFullYear() - 4) % 12;
  const zodiacEmoji = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"];
  const westernSigns = ["♈ Aries", "♉ Taurus", "♊ Gemini", "♋ Cancer", "♌ Leo", "♍ Virgo", "♎ Libra", "♏ Scorpio", "♐ Sagittarius", "♑ Capricorn", "♒ Aquarius", "♓ Pisces"];
  
  const westernZodiac = (dob: string) => {
    const date = new Date(dob);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return westernSigns[0];
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return westernSigns[1];
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return westernSigns[2];
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return westernSigns[3];
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return westernSigns[4];
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return westernSigns[5];
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return westernSigns[6];
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return westernSigns[7];
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return westernSigns[8];
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return westernSigns[9];
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return westernSigns[10];
    return westernSigns[11];
  };

  const currentWesternSign = westernZodiac(profile.dob);

  // --- ACTIONS ---

  const handleLiveUplink = async () => {
    if (isLiveActive) {
      liveSessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }

    playTacticalSound('blip');
    setIsLiveActive(true);
    
    try {
      const callbacks = {
        onopen: () => console.log("Live Uplink Open"),
        onmessage: (msg: any) => {
          const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData) {
            playRawPcm(audioData);
          }
        },
        onerror: (e: any) => {
          console.error("Live Error", e);
          setIsLiveActive(false);
        },
        onclose: () => setIsLiveActive(false)
      };

      const session = await connectToHandlerLive(callbacks);
      liveSessionRef.current = session;
    } catch (err) {
      console.error(err);
      setIsLiveActive(false);
    }
  };

  const playRawPcm = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    ctx.decodeAudioData(bytes.buffer, (buffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    });
  };

  const fetchAssetVideo = async () => {
    setLoadingVideo(true);
    playTacticalSound('flicker');
    const result = await generateAssetVideo(profile);
    if (result) {
      setAssetVideo(result);
      localStorage.setItem(`rav_video_flag_${profile.id}`, "true");
    }
    setLoadingVideo(false);
    playTacticalSound('success');
  };

  const fetchMissions = async () => {
    setLoadingMissions(true);
    playTacticalSound('blip');
    const result = await generateMissions(profile);
    setMissions(result);
    setLoadingMissions(false);
  };

  const addFieldReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportInput.trim() || analyzingReport) return;
    
    setAnalyzingReport(true);
    playTacticalSound('click');
    
    const analysis = await analyzeLog('ANOMALY', reportInput);
    const newReport: TacticalLog = {
      id: Date.now().toString(),
      type: 'CLARITY',
      content: reportInput,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setTerminalOutput(prev => [...prev, `[REPORT ANALYSIS] ${analysis}`]);
    setFieldReports(prev => [newReport, ...prev]);
    setReportInput('');
    setAnalyzingReport(false);
    playTacticalSound('success');
  };

  const fetchBriefing = async () => {
    setLoadingBriefing(true);
    playTacticalSound('blip');
    const result = await generateBriefing(profile);
    setBriefing(result);
    localStorage.setItem(`rav_briefing_${profile.id}`, result);
    setLoadingBriefing(false);
  };

  const fetchDirective = async () => {
    setLoadingDirective(true);
    playTacticalSound('flicker');
    const result = await generateStrategicDirective(profile);
    setDirective(result);
    setLoadingDirective(false);
    playTacticalSound('success');
  };

  const fetchShadowDirective = async () => {
    setLoadingShadow(true);
    playTacticalSound('flicker');
    const result = await generateShadowDirective(profile);
    setShadowDirective(result);
    setLoadingShadow(false);
    playTacticalSound('success');
  };

  const fetchPortrait = async () => {
    setLoadingPortrait(true);
    playTacticalSound('flicker');
    const result = await generateAssetPortrait(profile);
    if (result) {
      setPortrait(result);
      localStorage.setItem(`rav_portrait_${profile.id}`, result);
    }
    setLoadingPortrait(false);
    playTacticalSound('success');
  };

  const fetchYearly = async () => {
    setLoadingYearly(true);
    playTacticalSound('flicker');
    const year = new Date().getFullYear();
    const data = await analyzeYearlyCycle(year, profile);
    setYearlyData(data);
    setLoadingYearly(false);
    playTacticalSound('success');
  };

  const openTool = async (toolId: string, label: string) => {
    setActiveTool(label);
    setLoadingTool(true);
    setToolIntel(null);
    playTacticalSound('blip');
    
    let result = "";
    if (toolId === 'wealth') result = await analyzeWealthForecast(profile);
    else if (toolId === 'matrix') result = await analyzeSourceMatrix(profile);
    else result = await fetchMetaphysicalToolIntel(label, profile);
    
    setToolIntel(result);
    setLoadingTool(false);
  };

  const searchIntel = async (query: string) => {
    if (!query.trim()) return;
    setLoadingIntel(true);
    setIntelResult(null);
    playTacticalSound('click');
    if (query.includes(',') || query.length > 10) {
      const mapsIntel = await searchLocationIntel(query);
      setIntelResult(mapsIntel);
    } else {
      const result = await fetchFoundingIntel(query);
      setIntelResult(result);
    }
    setLoadingIntel(false);
  };

  const runCompatibility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTargetName || !compTargetDob) return;
    setLoadingComp(true);
    playTacticalSound('blip');
    const result = await analyzeCompatibility(
      { name: profile.fullName, dob: profile.dob },
      { name: compTargetName, dob: compTargetDob }
    );
    setCompResult(result);
    setLoadingComp(false);
    playTacticalSound('success');
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setLoadingDaily(true);
    playTacticalSound('click');
    const result = await fetchDailyFrequency(date, profile);
    setDailyIntel(result);
    setLoadingDaily(false);
    playTacticalSound('success');
  };

  const saveToNetwork = () => {
    if (!compResult || !compTargetName || !compTargetDob) return;
    const newAlly: CircleMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: compTargetName,
      dob: compTargetDob,
      type: 'other',
      compatibility: compResult.score
    };
    setAllies(prev => [newAlly, ...prev]);
    setCompResult(null);
    setCompTargetName('');
    setCompTargetDob('');
    playTacticalSound('success');
  };

  const removeAlly = (id: string) => {
    setAllies(prev => prev.filter(a => a.id !== id));
    playTacticalSound('flicker');
  };

  // --- RENDER VIEWS ---

  const DossierView = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
           <GlassCard title="ASSET VISUALIZATION">
              <HolographicDisplay src={portrait} loading={loadingPortrait} />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <TacticalButton onClick={fetchPortrait} variant="secondary" icon={<Camera size={14}/>}>Portrait</TacticalButton>
                <TacticalButton onClick={fetchAssetVideo} variant="secondary" icon={<Video size={14}/>}>Cinematic</TacticalButton>
              </div>
           </GlassCard>

           <AnimatePresence>
             {loadingVideo && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <GlassCard title="VEO UPLINK ACTIVE">
                   <div className="py-6 space-y-4">
                     <Loader2 className="animate-spin text-agency-gold mx-auto" size={32} />
                     <p className="text-[10px] font-mono text-center text-agency-gold/60 uppercase animate-pulse">Rendering Cinematic Asset Reel...</p>
                     <TacticalProgressBar progress={45} label="Encoding Stream" />
                   </div>
                 </GlassCard>
               </motion.div>
             )}
           </AnimatePresence>

           {assetVideo && (
             <GlassCard title="CINEMATIC REEL">
               <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                 <video src={assetVideo} controls autoPlay muted loop className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
                 <div className="absolute inset-0 pointer-events-none border border-agency-gold/20" />
               </div>
             </GlassCard>
           )}
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <MetricCard label="Life Path" value={`${lifePath}/9`} icon={<Fingerprint size={20}/>} />
             <MetricCard label="Earth Zodiac" value={zodiacEmoji[earthZodiac]} color="bg-orange-500" icon={<Activity size={20}/>} />
             <MetricCard label="Western" value={currentWesternSign.split(' ')[1]} color="bg-indigo-500" icon={<Zap size={20}/>} />
          </div>

          <GlassCard title="STRATEGIC BRIEFING">
             {!briefing ? (
               <div className="text-center py-20">
                 <TacticalButton onClick={fetchBriefing} disabled={loadingBriefing}>{loadingBriefing ? "DECRYPTING..." : "INITIATE SCAN"}</TacticalButton>
               </div>
             ) : (
               <div className="space-y-8">
                 <ProgressiveReveal content={briefing} />
                 
                 <div className="border-t border-white/5 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                     <h4 className="text-[10px] font-serif text-agency-gold uppercase tracking-[0.4em]">Deep Matrix Directive</h4>
                     {!directive ? (
                       <TacticalButton onClick={fetchDirective} variant="secondary" disabled={loadingDirective} className="w-full">
                         {loadingDirective ? "PARSING..." : "GENERATE FULL DIRECTIVE"}
                       </TacticalButton>
                     ) : <ProgressiveReveal content={directive} />}
                   </div>
                   
                   <div className="space-y-6">
                     <h4 className="text-[10px] font-serif text-red-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Skull size={12}/> Shadow Vector
                     </h4>
                     {!shadowDirective ? (
                       <TacticalButton onClick={fetchShadowDirective} variant="secondary" disabled={loadingShadow} className="w-full border-red-900/40 hover:border-red-500/40 text-red-500">
                         {loadingShadow ? "DECRYPTING..." : "DECODE SHADOW ARCHIVE"}
                       </TacticalButton>
                     ) : <ProgressiveReveal content={shadowDirective} />}
                   </div>
                 </div>
               </div>
             )}
          </GlassCard>
        </div>
      </div>
    </div>
  );

  const NetworkView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right duration-700">
      <div className="space-y-8">
        <GlassCard title="ASSET SYNCHRONICITY" icon={<Users size={14} className="text-agency-gold"/>}>
          <form onSubmit={runCompatibility} className="space-y-6">
             <TacticalInput 
               label="Subject Designation" 
               value={compTargetName}
               onChange={(e) => setCompTargetName(e.target.value)}
               placeholder="NAME / ALIAS"
             />
             <TacticalInput 
               label="Subject Origin Chronology" 
               type="date"
               value={compTargetDob}
               onChange={(e) => setCompTargetDob(e.target.value)}
             />
             <TacticalButton type="submit" disabled={loadingComp} className="w-full">
               {loadingComp ? <Loader2 className="animate-spin" /> : "Analyze Synchronicity"}
             </TacticalButton>
          </form>

          {compResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 bg-agency-gold/5 border border-agency-gold/20 rounded-2xl space-y-6">
               <div className="flex justify-center">
                 <CompatibilityGauge score={compResult.score} />
               </div>
               <p className="text-[10px] font-mono text-center text-gray-400 uppercase leading-relaxed">{compResult.summary}</p>
               <TacticalButton variant="secondary" onClick={saveToNetwork} className="w-full">Archive to Network</TacticalButton>
            </motion.div>
          )}
        </GlassCard>

        <GlassCard title="ACTIVE CONNECTIONS" icon={<Network size={14} className="text-agency-gold"/>}>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {allies.length === 0 ? (
              <p className="text-[10px] font-mono text-gray-600 text-center py-10">No network data archived.</p>
            ) : allies.map(ally => (
              <div key={ally.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-agency-gold/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-[11px] font-serif text-white uppercase tracking-widest">{ally.name}</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">SYNC: {ally.compatibility}%</span>
                </div>
                <button onClick={() => removeAlly(ally.id)} className="text-gray-700 hover:text-red-500 luxury-transition">
                  <UserMinus size={14} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="flex flex-col justify-center">
        <GlassCard title="NETWORK TOPOLOGY" className="aspect-square flex items-center justify-center">
          <NetworkWeb members={allies} userName={profile.fullName} />
        </GlassCard>
      </div>
    </div>
  );

  const ExploreView = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <HotspotMap />
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-1">
           <GlassCard title="GEOSPATIAL INTEL" icon={<Search size={14} className="text-agency-gold"/>}>
             <div className="space-y-6">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
                  Query the archive for tactical data on specific coordinates or corporate entities.
                </p>
                <div className="flex flex-col gap-4">
                  <TacticalInput 
                    label="Target Location / Entity" 
                    placeholder="E.G. NEW YORK, APPLE, FERRARI..."
                    value={exploreSearchInput}
                    onChange={(e) => setExploreSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') searchIntel(exploreSearchInput);
                    }}
                  />
                  <TacticalButton variant="secondary" onClick={() => searchIntel(exploreSearchInput)}>
                    Execute Search
                  </TacticalButton>
                </div>
             </div>
           </GlassCard>
         </div>

         <div className="lg:col-span-2">
            <GlassCard title="INTELLIGENCE FEED" icon={<DatabaseIcon size={14} className="text-agency-gold"/>}>
               <div className="min-h-[300px] flex items-center justify-center">
                 {loadingIntel ? (
                   <div className="flex flex-col items-center gap-6">
                     <Loader2 className="animate-spin text-agency-gold" size={32} />
                     <ScrambleText text="RETRIEVING DATA..." className="text-agency-gold/60" />
                   </div>
                 ) : intelResult ? (
                   <ProgressiveReveal content={intelResult} />
                 ) : (
                   <div className="text-center space-y-4 opacity-30">
                     <FileSearch size={48} className="mx-auto" />
                     <p className="text-[10px] font-mono uppercase tracking-[0.3em]">No intel loaded in this sector.</p>
                   </div>
                 )}
               </div>
            </GlassCard>
         </div>
       </div>
    </div>
  );

  const OpsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom duration-700">
      <div className="lg:col-span-8 space-y-8">
        <div className="h-[500px]">
          <TacticalTerminal 
            prompt="HANDLER@ARCHIVE:~$" 
            output={terminalOutput} 
            onCommand={async (cmd) => {
              setTerminalLoading(true);
              const output = await executeTerminalCommand(cmd, profile);
              setTerminalOutput(prev => [...prev, `HANDLER@ARCHIVE:~$ ${cmd}`, ...output]);
              setTerminalLoading(false);
              playTacticalSound('blip');
            }} 
            loading={terminalLoading}
          />
        </div>

        <GlassCard title="ACTIVE MISSION BOARD" icon={<Target size={14} className="text-agency-gold"/>}>
           {missions.length === 0 ? (
             <div className="py-20 text-center space-y-6">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">No active directives for this asset frequency.</p>
                <TacticalButton onClick={fetchMissions} disabled={loadingMissions} variant="secondary">
                   {loadingMissions ? <Loader2 className="animate-spin" /> : "Retrieve Field Directives"}
                </TacticalButton>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {missions.map(mission => (
                 <div key={mission.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-agency-gold/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[7px] px-2 py-0.5 rounded-full font-bold tracking-widest ${mission.priority === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-agency-gold/20 text-agency-gold'}`}>
                         {mission.priority}
                       </span>
                       <CheckCircle2 size={12} className="text-gray-700 group-hover:text-green-500" />
                    </div>
                    <h4 className="text-[11px] font-serif text-white uppercase tracking-widest mb-2">{mission.title}</h4>
                    <p className="text-[9px] font-mono text-gray-500 uppercase leading-relaxed line-clamp-4">{mission.objective}</p>
                 </div>
               ))}
             </div>
           )}
        </GlassCard>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <GlassCard title="SIGNAL MONITOR" icon={<Activity size={14} className="text-agency-gold"/>}>
           <div className="space-y-6">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <Oscilloscope active={true} className="w-full" />
                <div className="flex justify-between mt-2 text-[8px] font-mono text-agency-gold/60 uppercase">
                  <span>Freq: 440hz</span>
                  <span>Sync: Optimal</span>
                </div>
              </div>
              <div className="space-y-3 font-mono text-[9px] uppercase tracking-tighter text-gray-400">
                <p className="flex justify-between"><span>Biometric Trace:</span> <span className="text-green-500">Active</span></p>
                <p className="flex justify-between"><span>Neural Uplink:</span> <span className="text-green-500">Stable</span></p>
                <p className="flex justify-between"><span>Quadrant:</span> <span>Sector 7G</span></p>
              </div>
           </div>
        </GlassCard>

        <GlassCard title="FIELD REPORT LOG" icon={<FileSearch size={14} className="text-agency-gold"/>}>
          <form onSubmit={addFieldReport} className="mb-6">
            <div className="relative">
              <textarea 
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-[10px] font-mono focus:border-agency-gold focus:outline-none min-h-[100px] custom-scrollbar" 
                placeholder="Log field anomaly or strategic shift..."
                value={reportInput}
                onChange={(e) => setReportInput(e.target.value)}
              />
              <button disabled={analyzingReport} className="absolute bottom-4 right-4 p-2 bg-agency-gold text-black rounded-lg hover:scale-110 transition-transform disabled:opacity-50">
                {analyzingReport ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </form>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {fieldReports.map(report => (
              <div key={report.id} className="p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-agency-gold/30 transition-all">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[8px] font-mono text-agency-gold/60 uppercase">{report.timestamp}</span>
                   <ShieldAlert size={10} className="text-red-500 opacity-40 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter line-clamp-3">{report.content}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-serif text-white tracking-widest uppercase">Archive Configuration</h2>
          <p className="text-[10px] font-mono text-agency-gold/60 uppercase tracking-[0.4em]">Operational Parameters</p>
        </div>
        <Settings size={32} className="text-agency-gold/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard title="ACCOUNT PROTOCOLS">
          <div className="space-y-8 py-4">
             <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-agency-gold rounded-2xl flex items-center justify-center text-black font-serif font-bold text-2xl">
                 {profile.fullName.charAt(0)}
               </div>
               <div>
                 <h4 className="text-white font-serif tracking-widest uppercase">{profile.fullName}</h4>
                 <p className="text-[8px] font-mono text-gray-500 uppercase">Clearance Level: OMEGA-7</p>
               </div>
             </div>
             
             <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Archive Integrity</span>
                  <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Verified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Neural Sync</span>
                  <span className="text-[10px] font-mono text-agency-gold uppercase tracking-widest">Optimal</span>
                </div>
             </div>

             <TacticalButton variant="secondary" className="w-full" onClick={onLogout} icon={<Lock size={14}/>}>
               Suspend Session
             </TacticalButton>
          </div>
        </GlassCard>

        <GlassCard title="DATA LIQUIDATION">
           <div className="space-y-6 py-4 text-center">
             <div className="p-6 bg-red-900/10 border border-red-900/20 rounded-2xl">
                <ShieldAlert size={32} className="text-red-500 mx-auto mb-4" />
                <p className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] mb-2 font-bold">Caution: Terminal Action</p>
                <p className="text-[9px] font-mono text-gray-500 uppercase leading-relaxed">
                  Executing an archive purge will permanently erase your tactical dossier and synchronized biometrics from local memory.
                </p>
             </div>
             
             <TacticalButton variant="danger" className="w-full" icon={<Trash2 size={14}/>} onClick={() => {
               if (confirm("CONFIRM ARCHIVE PURGE? This action cannot be reversed.")) {
                 onLogout();
               }
             }}>
               Purge Archive Data
             </TacticalButton>
           </div>
        </GlassCard>

        <GlassCard title="SYSTEM INFORMATION">
           <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <Info size={16} className="text-agency-gold mt-1" />
                <p className="text-[9px] font-mono text-gray-400 uppercase leading-relaxed tracking-tight">
                  The Pre-Birth Archive operates on decentralized ledger technology intersected with Level 4 Generative Intelligence. Your Source Code is yours alone.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 text-[8px] font-mono text-gray-600 uppercase tracking-widest space-y-2">
                <p>Uplink Version: PBA-v2.5.0-ALPHA</p>
                <p>Node Status: Global Synchronization Complete</p>
                <p>Encryption Protocol: AES-X-512-V2</p>
              </div>
           </div>
        </GlassCard>

        <GlassCard title="AGENT DESIGNATION">
           <div className="py-4 space-y-6 flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <ShieldHalf size={64} className="text-agency-gold/20" />
                 <div className="absolute inset-0 border-2 border-agency-gold rounded-full border-dashed animate-spin-slow opacity-20" />
                 <span className="absolute font-serif text-white text-xl">Ω7</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-agency-gold uppercase tracking-[0.4em] mb-1">Status: Active Field Asset</p>
                <p className="text-[8px] font-mono text-gray-600 uppercase">Authorized for Deep Matrix Access</p>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-agency-gold" />
              </div>
              <p className="text-[8px] font-mono text-gray-600 uppercase">85% to Clearance OMEGA-8</p>
           </div>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-transparent text-gray-300 font-sans selection:bg-agency-gold selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-space-deep/95 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-agency-gold flex items-center justify-center font-serif text-black font-bold text-2xl rounded-xl shadow-lg cursor-pointer" onClick={() => setActiveTab('LAUNCHER')}>P</div>
          <div className="flex flex-col">
            <h1 className="text-agency-gold font-serif text-sm tracking-[0.4em] uppercase">The Pre-Birth Archive</h1>
            <SignalIndicator />
          </div>
        </div>
        
        <nav className="hidden xl:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {[
            { id: 'LAUNCHER', label: 'Launcher', icon: LayoutGrid },
            { id: 'DOSSIER', label: 'Briefing', icon: Archive },
            { id: 'NETWORK', label: 'Network', icon: Users },
            { id: 'EXPLORE', label: 'Explore', icon: Globe },
            { id: 'CALENDAR', label: 'Daily', icon: Timer },
            { id: 'OPS', label: 'Ops', icon: Command },
            { id: 'SETTINGS', label: 'Settings', icon: Settings },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id as TabType); playTacticalSound('click'); }} 
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-[9px] tracking-widest luxury-transition ${activeTab === item.id ? 'bg-agency-gold text-black shadow-xl shadow-agency-gold/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={14} />
              {item.label.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
             <p className="text-[11px] font-serif text-white tracking-[0.2em] uppercase">{profile.fullName}</p>
             <p className="text-[8px] font-mono text-agency-gold/60 uppercase">Asset Clearance Ω7</p>
          </div>
          <button onClick={() => { playTacticalSound('flicker'); onLogout(); }} className="text-gray-600 hover:text-red-400 luxury-transition"><Lock size={20} /></button>
        </div>
      </header>

      <main className="relative z-10 pt-40 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.02 }} 
            transition={{ duration: 0.6 }}
          >
            {activeTab === 'LAUNCHER' && (
               <div className="max-w-4xl mx-auto py-10">
                 <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
                   <div>
                     <h2 className="text-3xl font-serif text-white tracking-widest uppercase">Metaphysical Terminal</h2>
                     <p className="text-[10px] font-mono text-agency-gold/60 uppercase tracking-[0.4em]">Tactical Field Suite</p>
                   </div>
                   <LayoutGrid size={32} className="text-agency-gold/20" />
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                   {LAUNCHER_TOOLS.map((tool) => (
                     <motion.button
                       key={tool.id}
                       whileHover={{ scale: 1.05, y: -5 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => openTool(tool.id, tool.label)}
                       className="flex flex-col items-center gap-4 p-6 bg-[#0a0a0f] border border-white/5 rounded-2xl luxury-transition hover:border-agency-gold/40 group relative overflow-hidden"
                     >
                       <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-glow transition-all duration-500`}>
                         <tool.icon size={28} />
                       </div>
                       <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest text-center group-hover:text-white transition-colors">{tool.label}</span>
                     </motion.button>
                   ))}
                 </div>
               </div>
            )}
            
            {activeTab === 'DOSSIER' && <DossierView />}
            {activeTab === 'NETWORK' && <NetworkView />}
            {activeTab === 'EXPLORE' && <ExploreView />}
            
            {activeTab === 'CALENDAR' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                   <GlassCard title="TACTICAL DAILY FREQUENCY">
                     <div className="grid grid-cols-7 gap-3 mb-8">
                       {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                         const today = new Date();
                         const dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                         return (
                           <button 
                            key={d} 
                            onClick={() => handleDateSelect(dStr)}
                            className={`h-16 flex items-center justify-center rounded-xl font-mono text-xs transition-all duration-300 border ${
                              selectedDate === dStr ? 'bg-agency-gold border-agency-gold text-black shadow-glow-gold' : 'bg-white/5 border-white/5 text-gray-400'
                            }`}
                           >
                             {d}
                           </button>
                         );
                       })}
                     </div>
                     <div className="p-8 bg-black/40 rounded-2xl border border-white/5 min-h-[160px] flex items-center justify-center">
                        {loadingDaily ? <Loader2 className="animate-spin text-agency-gold" /> : (
                          <p className="text-sm font-mono text-center max-w-lg leading-relaxed uppercase tracking-tight">
                            {dailyIntel || "Select a sequence node to decode frequency pulse."}
                          </p>
                        )}
                     </div>
                   </GlassCard>
                </div>
                <div className="lg:col-span-4 space-y-8">
                   <GlassCard title="YEARLY TRAJECTORY">
                      {yearlyData.length > 0 ? (
                        <TrajectoryBarChart data={yearlyData} />
                      ) : (
                        <div className="py-20 text-center">
                          <TacticalButton onClick={fetchYearly} variant="secondary" disabled={loadingYearly} className="w-full">
                            {loadingYearly ? "MODELING CYCLES..." : "MODEL YEARLY CYCLE"}
                          </TacticalButton>
                        </div>
                      )}
                   </GlassCard>
                   <div className="bg-agency-gold p-10 rounded-3xl flex flex-col items-center text-black shadow-2xl">
                     <h4 className="text-6xl font-serif font-bold tracking-tighter my-2">{lifePath}/9</h4>
                     <p className="text-[9px] font-mono uppercase tracking-widest font-bold">Current Cycle Omega</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'OPS' && <OpsView />}
            {activeTab === 'SETTINGS' && <SettingsView />}
            
            <AnimatePresence>
              {activeTool && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                  <GlassCard className="max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" title={`UPLINK: ${activeTool.toUpperCase()}`}>
                    {activeTool === 'Source Matrix' && <MatrixRain className="absolute inset-0 z-0" />}
                    <div className="py-10 px-4 relative z-10 overflow-y-auto custom-scrollbar">
                      {loadingTool ? (
                         <div className="flex flex-col items-center py-20 gap-8">
                           <Loader2 className="animate-spin text-agency-gold" size={64} />
                           <ScrambleText text="SYNCHRONIZING..." className="text-agency-gold/60" />
                         </div>
                      ) : (
                        <div className="space-y-8">
                          {activeTool === 'Wealth Vector' && <CyberLineChart data={[10, 45, 30, 85, 60, 95]} label="Economic Signal" />}
                          <ProgressiveReveal content={toolIntel || "SIGNAL LOST."} />
                          <div className="pt-8 border-t border-white/5 flex justify-center">
                            <TacticalButton onClick={() => setActiveTool(null)} variant="secondary">Disconnect</TacticalButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      <button 
        onClick={() => { setIsChatOpen(true); playTacticalSound('blip'); }} 
        className="fixed bottom-28 lg:bottom-12 right-12 z-40 w-16 h-16 bg-agency-gold text-black rounded-full flex items-center justify-center shadow-[0_0_30px_#D4AF37] hover:scale-110 luxury-transition"
      >
        <MessageCircle size={30} />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative w-full max-w-xl bg-space-deep border-l border-white/10 h-full flex flex-col">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div>
                  <h3 className="font-serif text-agency-gold text-sm tracking-[0.4em] uppercase">Handler Uplink</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{isLiveActive ? 'Live Audio Session' : 'Encrypted Chat Mode'}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={handleLiveUplink}
                    className={`p-3 rounded-xl luxury-transition flex flex-col items-center gap-1 ${isLiveActive ? 'bg-red-500 text-white' : 'bg-white/5 text-agency-gold hover:bg-agency-gold hover:text-black'}`}
                   >
                     <Mic size={20} />
                     <span className="text-[6px] font-bold">LIVE</span>
                   </button>
                   <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white luxury-transition"><X size={28}/></button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {isLiveActive && (
                  <div className="flex flex-col items-center justify-center py-20 gap-6 bg-agency-gold/5 border border-agency-gold/20 rounded-3xl">
                     <Headphones size={48} className="text-agency-gold animate-pulse-slow" />
                     <WaveformVisualizer active={true} />
                     <p className="text-[10px] font-mono text-agency-gold/60 uppercase tracking-widest">Listening for directives...</p>
                  </div>
                )}
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 border rounded-2xl ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-agency-gold/10 border-agency-gold/30 text-agency-gold/90'}`}>
                      <ReactMarkdown className="leading-relaxed prose prose-invert prose-sm font-sans text-[11px] uppercase tracking-tight">{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {loadingChat && (
                   <div className="flex justify-start">
                     <div className="bg-agency-gold/5 p-4 rounded-xl border border-agency-gold/20">
                       <ScrambleText text="DECRYPTING RESPONSE..." className="text-[10px] text-agency-gold/60" />
                     </div>
                   </div>
                )}
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!chatInput.trim() || loadingChat) return;
                const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: Date.now() };
                setChatHistory(prev => [...prev, userMsg]);
                setChatInput('');
                setLoadingChat(true);
                const resp = await chatWithHandler([...chatHistory, userMsg], chatInput, profile);
                setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: resp, timestamp: Date.now() }]);
                setLoadingChat(false);
                playTacticalSound('blip');
              }} className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-4">
                <input className="flex-1 bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-sm focus:border-agency-gold focus:outline-none" placeholder="Transmit tactical data..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={loadingChat} />
                <button type="submit" className="bg-agency-gold text-black px-8 rounded-2xl flex items-center justify-center hover:bg-white shadow-glow-gold"><Send size={24} /></button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
