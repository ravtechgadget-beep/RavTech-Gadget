
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthAccess from './components/AuthAccess';
import DataIntake from './components/DataIntake';
import Dashboard from './components/Dashboard';
import CinematicInitiation from './components/CinematicInitiation';
import { AppView, UserProfile } from './types';
import { ScrambleText, Starfield } from './components/SpyUI';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

// Storage keys for session persistence
const PROFILE_KEY = 'rav_user_profile';
const THEME_KEY = 'rav_app_theme';
const VIEW_KEY = 'rav_current_view';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialization: Load profile, theme, and view from persistence
  useEffect(() => {
    const initializeArchive = async () => {
      // Simulate decryption delay for aesthetic
      await new Promise(resolve => setTimeout(resolve, 1200));

      const savedProfile = localStorage.getItem(PROFILE_KEY);
      let profileFound = false;
      
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUserProfile(parsedProfile);
          setCurrentView(AppView.DASHBOARD);
          profileFound = true;
        } catch (error) {
          console.error("Archive integrity check failed. Clearing corrupted session.", error);
          localStorage.removeItem(PROFILE_KEY);
        }
      }

      if (!profileFound) {
        const savedView = localStorage.getItem(VIEW_KEY) as AppView | null;
        if (savedView && Object.values(AppView).includes(savedView) && savedView !== AppView.DASHBOARD) {
          setCurrentView(savedView);
        } else {
          setCurrentView(AppView.LANDING);
        }
      }

      const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setTheme(initialTheme);
      applyTheme(initialTheme);
      
      setIsInitialized(true);
    };

    initializeArchive();
  }, []);

  useEffect(() => {
    if (isInitialized && currentView !== AppView.DASHBOARD && currentView !== AppView.CINEMATIC) {
      localStorage.setItem(VIEW_KEY, currentView);
    }
  }, [currentView, isInitialized]);

  const applyTheme = (targetTheme: 'dark' | 'light') => {
    const root = window.document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const handleUplink = () => setCurrentView(AppView.AUTH);

  const handleAuthenticated = () => {
    if (userProfile) {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.INTAKE);
    }
  };

  const handleIntakeComplete = (profileData: UserProfile) => {
    const newProfile = { 
      ...profileData, 
      id: `PBA-ASSET-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
    };
    setUserProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    localStorage.removeItem(VIEW_KEY);
    setCurrentView(AppView.CINEMATIC);
  };

  const handleInitiationComplete = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(VIEW_KEY);
    setUserProfile(null);
    setCurrentView(AppView.LANDING);
  };

  if (!isInitialized) {
    return (
      <div className="bg-space-deep h-screen w-full flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-2 border-agency-gold/20 border-t-agency-gold rounded-full animate-spin shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
        <div className="text-agency-gold font-mono text-xs tracking-[0.5em] uppercase">
          <ScrambleText text="DECRYPTING PRE-BIRTH ARCHIVE..." />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onUplink={handleUplink} />;
      case AppView.AUTH:
        return <AuthAccess onAuthenticated={handleAuthenticated} />;
      case AppView.INTAKE:
        return <DataIntake onComplete={handleIntakeComplete} />;
      case AppView.CINEMATIC:
        return userProfile ? <CinematicInitiation profile={userProfile} onComplete={handleInitiationComplete} /> : <LandingPage onUplink={handleUplink} />;
      case AppView.DASHBOARD:
        return userProfile ? (
          <Dashboard profile={userProfile} onLogout={handleLogout} />
        ) : (
          <LandingPage onUplink={handleUplink}/>
        );
      default:
        return <LandingPage onUplink={handleUplink} />;
    }
  };

  return (
    <div className={`scanlines min-h-screen transition-colors duration-700 ${theme === 'light' ? 'light-theme' : 'bg-space-deep'}`}>
      <Starfield />
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="fixed bottom-10 right-10 z-[100] p-4 rounded-full bg-agency-black/80 backdrop-blur-xl border border-agency-gold/30 text-agency-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-agency-gold hover:shadow-agency-gold/40 transition-all duration-500 group overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center">
          {theme === 'dark' ? <Sun size={22} className="animate-pulse-slow" /> : <Moon size={22} />}
        </div>
        <div className="absolute inset-0 bg-agency-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 w-full h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
