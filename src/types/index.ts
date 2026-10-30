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
  summary?: string;
  transcript?: string;
  isAiCalculated?: boolean;
  aiModel?: string;
  inferenceMode?: string;
  latencyMs?: number;
  clinicalConfidence?: string;
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

export interface ExtractedReportData {
  success: boolean;
  errorType?: 'NO_TEXT_DETECTED' | 'NO_REPORT_DETECTED' | 'SERVER_ERROR';
  message?: string;
  fileName: string;
  totalPages: number;
  rawExtractedText: string;
  patient?: PatientProfile;
  parameters?: LabParameter[];
  dietPlan?: DietPlan;
  summary?: string;
  transcript?: string;
  confidenceScore?: string;
}


