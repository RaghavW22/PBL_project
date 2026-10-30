let cachedBaseUrl: string | null = null;

export async function getBackendBaseUrl(): Promise<string> {
  if (cachedBaseUrl !== null) return cachedBaseUrl;

  // Try relative endpoint first (works via Vite proxy)
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      cachedBaseUrl = '';
      return '';
    }
  } catch (_) {}

  // Try direct localhost:5000 (works if frontend opened directly without proxy)
  try {
    const res = await fetch('http://localhost:5000/api/health');
    if (res.ok) {
      cachedBaseUrl = 'http://localhost:5000';
      return 'http://localhost:5000';
    }
  } catch (_) {}

  cachedBaseUrl = '';
  return '';
}

import { DietPlan } from '../types';

export interface ReportTranslationPayload {
  transcript: string;
  summary: string;
  riskTitle: string;
  riskDescription: string;
  target_lang: string;
  parameters?: { id: string; name?: string; explanation?: string }[];
  dietPlan?: DietPlan;
}

export interface ReportTranslationResponse {
  success: boolean;
  target_lang: string;
  transcript: string;
  summary: string;
  riskTitle: string;
  riskDescription: string;
  parameters?: { id: string; explanation?: string }[];
  dietPlan?: DietPlan;
}

export interface MedGemmaRiskResponse {
  success: boolean;
  model: string;
  clinicalConfidence: string;
  riskScore: number;
  riskLevel: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
  riskTitle: string;
  riskDescription: string;
  normalCount: number;
  varianceCount: number;
  totalParameters: number;
  isAiCalculated?: boolean;
  inferenceMode?: string;
  latencyMs?: number;
  summary?: string;
  transcript?: string;
}

/**
 * Checks if the Python FastAPI translation backend is running
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const baseUrl = await getBackendBaseUrl();
    const res = await fetch(`${baseUrl}/api/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'online';
  } catch (err) {
    return false;
  }
}

/**
 * Calls the MedGemma 1.5 Flash risk assessment endpoint in the Python backend
 */
export async function analyzeRiskWithMedGemma(
  patientName: string,
  age: number,
  gender: string,
  parameters: { id?: string; name: string; observedValue?: string; standardRange?: string; status?: string }[]
): Promise<MedGemmaRiskResponse | null> {
  try {
    const baseUrl = await getBackendBaseUrl();
    const res = await fetch(`${baseUrl}/api/analyze-risk-medgemma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: patientName,
        age: age,
        gender: gender,
        parameters: parameters.map(p => ({
          id: p.id,
          name: p.name,
          observedValue: p.observedValue,
          standardRange: p.standardRange,
          status: p.status || 'NORMAL'
        }))
      })
    });

    if (!res.ok) return null;
    const data: MedGemmaRiskResponse = await res.json();
    return data;
  } catch (err) {
    console.warn('[MedGemma API] Fallback to client heuristics:', err);
    return null;
  }
}

/**
 * Calls the Python backend to translate full report content dynamically
 */
export async function translateReportWithPythonBackend(
  payload: ReportTranslationPayload
): Promise<ReportTranslationResponse | null> {
  try {
    const baseUrl = await getBackendBaseUrl();
    const res = await fetch(`${baseUrl}/api/translate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[TranslationService] Python backend returned error:', res.status);
      return null;
    }

    const data: ReportTranslationResponse = await res.json();
    return data;
  } catch (err) {
    console.warn('[TranslationService] Could not reach Python backend:', err);
    return null;
  }
}

/**
 * Calls the Python backend to translate a single string
 */
export async function translateTextWithPythonBackend(
  text: string,
  targetLang: string
): Promise<string> {
  if (!text || !text.trim()) return text;
  
  try {
    const baseUrl = await getBackendBaseUrl();
    const res = await fetch(`${baseUrl}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, target_lang: targetLang }),
    });

    if (!res.ok) return text;

    const data = await res.json();
    return data.translated || text;
  } catch (err) {
    return text;
  }
}
