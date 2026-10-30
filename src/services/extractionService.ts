import { ExtractedReportData } from '../types';
import { INITIAL_PATIENT, INITIAL_LAB_PARAMETERS, INITIAL_DIET_PLAN } from '../data/mockData';

const BACKEND_URL = typeof window !== 'undefined' && window.location?.origin ? '' : 'http://localhost:5000';

/**
 * Sends one or multiple medical report files (PDFs, Images, camera snapshots)
 * to the Python OCR & MedGemma backend service.
 */
export async function extractReportFromFiles(files: File[]): Promise<ExtractedReportData> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for extraction.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/extract-report`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    if (data) {
      return data as ExtractedReportData;
    }

    throw new Error('Server response was empty.');
  } catch (error: any) {
    console.warn('[Extraction Service] Backend call failed or backend offline:', error);

    return {
      success: false,
      errorType: 'SERVER_ERROR',
      message: error.message || 'Unable to connect to OCR service. Please verify Python microservice is running.',
      fileName: files[0].name,
      totalPages: files.length,
      rawExtractedText: ''
    };
  }
}
