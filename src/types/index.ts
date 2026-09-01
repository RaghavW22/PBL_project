export interface IndianVoiceLocale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface LabParameter {
  id: string;
  name: string;
  category: string;
  subText: string;
  observedValue: string;
  standardRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW';
  explanation: string;
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  sampleDate: string;
  riskScore: number;
  riskLevel: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
  riskTitle: string;
  riskDescription: string;
  normalCount: number;
  varianceCount: number;
}

export interface DietPlan {
  include: { title: string; desc: string }[];
  avoid: { title: string; desc: string }[];
  tips: { title: string; desc: string }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TechNode {
  id: string;
  title: string;
  category: 'input' | 'processing' | 'backend' | 'client';
  description: string;
  techs: string[];
}

export interface MultilingualTranslation {
  transcript: string;
  summary: string;
  riskTitle: string;
  riskDesc: string;
}
