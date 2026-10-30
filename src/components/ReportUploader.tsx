import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Camera, 
  Sparkles,
  Loader2,
  X,
  Plus,
  Trash2,
  Maximize2,
  Layers,
  Check,
  AlertCircle,
  AlertTriangle,
  FileWarning
} from 'lucide-react';
import { PatientProfile, LabParameter, DietPlan } from '../types';
import { extractReportFromFiles } from '../services/extractionService';

interface ReportUploaderProps {
  onReportProcessed: (
    patient: PatientProfile, 
    params: LabParameter[], 
    fileName: string, 
    rawText?: string, 
    dietPlan?: DietPlan
  ) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  onReportProcessed,
  onShowToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Scanning report OCR & extracting lab metrics...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extraction Alert Modal State (when no text or no report is detected)
  const [extractionAlert, setExtractionAlert] = useState<{
    title: string;
    message: string;
    type: 'NO_TEXT' | 'NO_REPORT' | 'ERROR';
  } | null>(null);

  // Camera Capture Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPages, setCapturedPages] = useState<Array<{ id: string; blob: Blob; url: string; name: string }>>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera tracks cleanly on unmount or close
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please verify camera permissions in your browser.');
      onShowToast('Camera permission denied or camera unavailable.', 'warning');
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhotoPage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match actual camera feed resolution
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flash shutter animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const pageNumber = capturedPages.length + 1;
        const pageName = `report_page_${pageNumber}.jpg`;
        const previewUrl = URL.createObjectURL(blob);

        setCapturedPages(prev => [
          ...prev, 
          { id: `${Date.now()}_${pageNumber}`, blob, url: previewUrl, name: pageName }
        ]);

        onShowToast(`Page ${pageNumber} photographed successfully! Capture next page or finish.`, 'success');
      }
    }, 'image/jpeg', 0.95);
  };

  const removeCapturedPage = (id: string) => {
    setCapturedPages(prev => {
      const filtered = prev.filter(p => p.id !== id);
      // Revoke old object url to free memory
      const removed = prev.find(p => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const submitCapturedPages = async () => {
    if (capturedPages.length === 0) {
      onShowToast('Please capture at least one page photo before analyzing.', 'warning');
      return;
    }

    const files = capturedPages.map((page, index) => {
      return new File([page.blob], page.name, { type: 'image/jpeg' });
    });

    closeCamera();
    await executeReportExtraction(files);
  };

  const executeReportExtraction = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgress(15);
    const count = files.length;
    const isMulti = count > 1;
    const combinedTitle = isMulti ? `${count} Pages Report` : files[0].name;

    setStatusText(`Ingesting ${count} document page(s) into OCR pipeline...`);

    // Fast progress interval paced for Groq Cloud LPU AI (~1-2s response)
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 40) {
          setStatusText('Enhancing image contrast & running Tesseract 5.5 OCR...');
          return prev + 12;
        } else if (prev < 70) {
          setStatusText('Extracting clinical biomarker tables & reference intervals...');
          return prev + 10;
        } else if (prev < 92) {
          setStatusText('Evaluating Health Risk Index with Groq Cloud AI...');
          return prev + 8;
        } else if (prev < 98) {
          setStatusText('Finalizing clinical synthesis & diet protocol...');
          return prev + 1;
        }
        return prev;
      });
    }, 250);

    try {
      const result = await extractReportFromFiles(files);
      clearInterval(progressTimer);

      if (!result.success) {
        setIsProcessing(false);
        const title = result.errorType === 'NO_TEXT_DETECTED' 
          ? 'No Readable Text Detected' 
          : result.errorType === 'NO_REPORT_DETECTED'
          ? 'No Medical Lab Report Detected'
          : 'Document Extraction Issue';

        setExtractionAlert({
          title,
          message: result.message || 'No medical report or readable text was found in the uploaded file.',
          type: result.errorType === 'NO_TEXT_DETECTED' ? 'NO_TEXT' : 'NO_REPORT'
        });

        onShowToast(result.message || 'No medical report or text detected.', 'warning');
        return;
      }

      setProgress(100);
      setStatusText('Complete! Finalizing medical dashboard...');

      setTimeout(() => {
        setIsProcessing(false);
        if (result.patient && result.parameters) {
          const updatedPatient = {
            ...result.patient,
            summary: result.summary,
            transcript: result.transcript
          };
          onReportProcessed(
            updatedPatient, 
            result.parameters, 
            result.fileName || combinedTitle,
            result.rawExtractedText,
            result.dietPlan
          );
        }
        onShowToast(
          `Extracted ${result.parameters?.length || 0} biomarkers from ${result.totalPages} page(s) successfully!`, 
          'success'
        );

        // Scroll to dashboard
        const dash = document.getElementById('dashboard');
        if (dash) dash.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err: any) {
      clearInterval(progressTimer);
      setIsProcessing(false);
      console.error('OCR Extraction error:', err);
      setExtractionAlert({
        title: 'Extraction Error',
        message: err.message || 'Failed to process document. Please try again.',
        type: 'ERROR'
      });
      onShowToast(`Extraction error: ${err.message || 'Failed to process document'}`, 'warning');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      executeReportExtraction(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      executeReportExtraction(files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Hidden offscreen canvas for taking high-res photo frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Dropzone Container */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`liquid-glass rounded-3xl p-8 sm:p-10 border transition-all duration-300 relative overflow-hidden backdrop-blur-2xl ${
          isDragging ? 'liquid-glass-active border-cyan-400 scale-[1.01]' : 'border-white/15 hover:border-white/25'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          multiple
          className="hidden" 
        />

        {/* Normal Idle State */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20 group hover:scale-110 transition-transform cursor-pointer"
              title="Upload PDF or Image"
            >
              <UploadCloud className="w-8 h-8" />
            </div>

            <div 
              onClick={startCamera}
              className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/20 group hover:scale-110 transition-transform cursor-pointer"
              title="Take Photos (Multi-page Camera)"
            >
              <Camera className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Drop Lab Report here,{' '}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Browse Files
              </button>
              {' '}or{' '}
              <button 
                onClick={startCamera}
                className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Camera className="w-4 h-4 inline" /> Take Photos
              </button>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supports single or multi-page <strong>PDF</strong>, <strong>PNG</strong>, <strong>JPG</strong>, or multi-page camera photos
            </p>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Choose Files / PDF</span>
            </button>

            <button
              onClick={startCamera}
              className="px-5 py-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-semibold hover:bg-blue-500/30 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10"
            >
              <Camera className="w-4 h-4" />
              <span>Multi-Page Camera</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Tesseract 5.5 OCR
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Multi-Page PDF & Photo
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              MedGemma 1.5 Flash
            </span>
          </div>
        </div>

        {/* Processing Animated Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            
            {/* Animated Laser Scan Beam */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan absolute top-0 left-0 shadow-[0_0_15px_#22d3ee]"></div>

            <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin shadow-xl shadow-cyan-500/30">
              <Loader2 className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md">
              <p className="text-sm sm:text-base font-semibold text-white tracking-wide">{statusText}</p>
              
              {/* Progress Bar Track */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/10 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-cyan-400">{progress}% COMPLETED</p>
            </div>
          </div>
        )}

      </div>

      {/* MULTI-PAGE CAMERA CAPTURE MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          
          {/* Top Bar Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between py-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
              <Camera className="w-5 h-5 text-cyan-400" />
              <span>Multi-Page Report Photo Scanner</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {capturedPages.length} {capturedPages.length === 1 ? 'Page' : 'Pages'} Captured
              </span>
            </div>

            <button
              onClick={closeCamera}
              className="p-2 rounded-full bg-slate-900 border border-white/15 text-slate-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors"
              title="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewfinder Area */}
          <div className="relative w-full max-w-3xl flex-1 my-4 flex items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/50 shadow-2xl">
            {cameraError ? (
              <div className="flex flex-col items-center text-center p-6 text-rose-300 gap-3">
                <AlertCircle className="w-10 h-10 text-rose-400" />
                <p className="text-sm font-semibold">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white border border-white/20 hover:bg-slate-700"
                >
                  Retry Camera Access
                </button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover rounded-3xl"
                />

                {/* Shutter Visual Flash */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white/80 z-20 transition-opacity duration-150" />
                )}

                {/* Document Alignment Overlay Box with Corner Brackets */}
                <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-950/80 text-cyan-200 border border-cyan-400/40 shadow-lg">
                      Align lab report page inside frame & capture
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Captured Pages Thumbnail Tray */}
          {capturedPages.length > 0 && (
            <div className="w-full max-w-4xl overflow-x-auto py-2 flex items-center gap-3 px-2 mb-2 scrollbar-thin">
              {capturedPages.map((page, idx) => (
                <div 
                  key={page.id} 
                  className="relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-slate-900 shadow-md group"
                >
                  <img src={page.url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    P{idx + 1}
                  </span>
                  <button
                    onClick={() => removeCapturedPage(page.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 hover:text-white"
                    title="Delete page photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="w-full max-w-4xl flex items-center justify-center gap-4 pt-2">
            
            {/* Capture Page Shutter Button */}
            <button
              onClick={capturePhotoPage}
              disabled={!!cameraError}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[3px] shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              title="Photograph Current Page"
            >
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border border-cyan-400">
                <div className="w-10 h-10 rounded-full bg-cyan-400" />
              </div>
            </button>

            {/* Finish & Process All Pages Button */}
            {capturedPages.length > 0 && (
              <button
                onClick={submitCapturedPages}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-mono font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Process {capturedPages.length} Page{capturedPages.length > 1 ? 's' : ''}</span>
              </button>
            )}

          </div>

        </div>
      )}

      {/* EXTRACTION ALERT MODAL (When no report or text is detected) */}
      {extractionAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg liquid-glass-active rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-5">
            
            {/* Header with Warning Icon */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {extractionAlert.title}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    Verification Needed
                  </span>
                </div>
              </div>

              <button
                onClick={() => setExtractionAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed">
              {extractionAlert.message}
            </div>

            {/* Practical Troubleshooting Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Tips for Accurate Extraction:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Ensure good lighting and avoid direct glare or dark shadows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Place the document flat and align all borders inside the camera frame.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Ensure the document is a medical pathology report (e.g. CBC, Lipid, Blood Sugar, Thyroid).</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setExtractionAlert(null);
                  startCamera();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photos</span>
              </button>

              <button
                onClick={() => {
                  setExtractionAlert(null);
                  fileInputRef.current?.click();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-900 border border-white/20 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Choose File / PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
