const BACKEND_URL = typeof window !== 'undefined' && window.location?.origin ? '' : 'http://localhost:5000';

export interface AiConfigData {
  success: boolean;
  active_provider: 'gemini_cloud' | 'groq_cloud' | 'local_ollama';
  has_gemini_key: boolean;
  has_groq_key: boolean;
  gemini_model: string;
  groq_model: string;
  masked_gemini_key?: string;
  masked_groq_key?: string;
  ollama_available: boolean;
}

export async function fetchAiConfig(): Promise<AiConfigData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config/ai-provider`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[AI Config] Failed to fetch config:', err);
    return null;
  }
}

export async function updateAiConfig(payload: {
  provider: 'gemini_cloud' | 'groq_cloud' | 'local_ollama';
  gemini_api_key?: string;
  groq_api_key?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config/ai-provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { success: false, message: 'Server returned error' };
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function testAiKey(payload: {
  provider: 'gemini_cloud' | 'groq_cloud';
  api_key: string;
}): Promise<{ success: boolean; latencyMs?: number; message: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config/test-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection test failed' };
  }
}
