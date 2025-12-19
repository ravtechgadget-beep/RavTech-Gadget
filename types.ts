
export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  INTAKE = 'INTAKE',
  CINEMATIC = 'CINEMATIC',
  DASHBOARD = 'DASHBOARD',
}

export interface UserProfile {
  id: string;
  fullName: string;
  dob: string; // YYYY-MM-DD
  birthTime: string;
  birthLocation: string;
  lifePathNumber?: number;
  archetype?: string;
  isPremium?: boolean;
  avatarUrl?: string;
}

export interface CircleMember {
  id: string;
  name: string;
  dob: string;
  type: 'family' | 'friend' | 'work' | 'partner' | 'other';
  compatibility?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TacticalLog {
  id: string;
  type: 'LIE' | 'FEAR' | 'CLARITY' | 'IMPACT';
  content: string;
  timestamp: string;
}

export interface TacticalMission {
  id: string;
  title: string;
  objective: string;
  status: 'ACTIVE' | 'COMPLETED' | 'REDACTED';
  priority: 'LOW' | 'MEDIUM' | 'CRITICAL';
}

export enum DossierType {
  BRIEFING = 'BRIEFING',
  STRATEGIC = 'STRATEGIC',
}
