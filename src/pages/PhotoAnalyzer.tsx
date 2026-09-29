import React, { useRef, useState } from 'react';
import { Camera, ImagePlus, Sparkles, Upload, X, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { analyzePhoto as analyzePhotoApi } from '../services/api';

const PHOTO_ANALYSIS_ENDPOINT = import.meta.env.VITE_PHOTO_ANALYSIS_ENDPOINT || '';

interface AnalysisResult {
  identified: boolean;
  brand: string | null;
  name: string | null;
  concentration: string | null;
  tier: 'designer' | 'niche' | 'drugstore' | 'unknown';
  notes: { top: string[]; middle: string[]; base: string[] };
  scentProfile: string;
  accords: string[];
  confidence: number;
  hasDupes: boolean;
  dupes: Array<{ brand: string; name: string; price: string; reason: string }>;
  similarProfiles: Array<{ brand: string; name: string; reason: string }>;
  source: 'bedrock' | 'local';
}

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const MAX = 1024;
      let { width, height } = img;
      if (width > height && width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      else if (height > width && height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      else if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
    };
    img.onerror = reject;
    img.src = url;
  });
}

const tierColors: Record<string, string> = {
  designer: 'border-[#0A1128]/20 text-[#0A1128]',
  niche: 'border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/5',
  drugstore: 'border-[#0A1128]/20 text-[#0A1128]',
  unknown: 'border-[#0A1128]/10 text-[#0A1128]/50',
};

const tierLabels: Record<string, string> = {
  designer: 'Designer',
  niche: 'Niche / Luxury',
  drugstore: 'Drugstore',
  unknown: 'Unknown',
};

const PhotoAnalyzer: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const clearUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setFileName('');
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const analyzeFile = async (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      const { base64: imageBase64, mimeType } = await fileToBase64(file);
      let data: any;

      if (PHOTO_ANALYSIS_ENDPOINT) {
        const response = await fetch(PHOTO_ANALYSIS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64, mimeType }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const message = [err.error, err.details].filter(Boolean).join(': ');
          throw new Error(message || `Server error ${response.status}`);
        }

        const payload = await response.json();
        data = payload.data || payload;
      } else {
        const payload = await analyzePhotoApi(imageBase64, mimeType);
        data = payload.data || payload;
      }

      setResult({
        identified: data.identified !== false,
        brand: data.brand || null,
        name: data.name || null,
        concentration: data.concentration || null,
        tier: data.tier || 'unknown',
        notes: {
          top: Array.isArray(data.notes?.top) ? data.notes.top : [],
          middle: Array.isArray(data.notes?.middle) ? data.notes.middle : [],
          base: Array.isArray(data.notes?.base) ? data.notes.base : [],
        },
        scentProfile: data.scentProfile || '',
        accords: Array.isArray(data.accords) ? data.accords : [],
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.8,
        hasDupes: data.hasDupes === true,
        dupes: Array.isArray(data.dupes) ? data.dupes : [],
        similarProfiles: Array.isArray(data.similarProfiles) ? data.similarProfiles : [],
        source: 'bedrock',
      });
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setError('Image too large. Max 4MB.'); return; }
    analyzeFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) { setError('Image too large. Max 4MB.'); return; }
    analyzeFile(file);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-[#F9F8F6] text-[#0A1128]">
      <div className="mx-auto max-w-[1600px]">

        {/* Editorial Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[#0A1128]/10 pb-12">
          <div className="max-w-2xl">
            <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-4 block">Visual Recognition</span>
            <h1 className="text-5xl lg:text-7xl font-editorial tracking-tight mb-6">Photographic Analysis</h1>
            <p className="text-[#0A1128]/70 text-lg font-light leading-relaxed">
              Upload a photograph of any bottle. Our intelligence engine will deconstruct its notes, classify its tier, and surface affordable alternatives.
            </p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 bg-[#0A1128] px-8 py-4 text-[11px] uppercase tracking-widest font-medium text-white transition-colors hover:bg-[#7C3AED]"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </button>
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="grid gap-12 lg:grid-cols-[450px,1fr] items-start">

          {/* Left: Image Upload Area */}
          <div className="bg-white border border-[#0A1128]/10 p-6 sticky top-32 shadow-sm">
            {previewUrl ? (
              <div>
                <div className="relative overflow-hidden border border-[#0A1128]/10 bg-[#F9F8F6]">
                  <img src={previewUrl} alt="Uploaded perfume" className="aspect-[4/5] w-full object-cover mix-blend-multiply" />
                  <button
                    onClick={clearUpload}
                    className="absolute right-4 top-4 rounded-full bg-[#F9F8F6] p-3 text-[#0A1128] hover:text-[#7C3AED] transition-colors border border-[#0A1128]/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-4 truncate text-[11px] uppercase tracking-widest text-[#0A1128]/50 text-center">{fileName}</p>
              </div>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`flex aspect-[4/5] w-full flex-col items-center justify-center border border-dashed transition-colors ${
                  dragOver ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-[#0A1128]/20 bg-[#F9F8F6]/50 hover:border-[#0A1128]/50'
                }`}
              >
                <Camera className="mb-6 h-8 w-8 text-[#0A1128]/30" strokeWidth={1} />
                <span className="text-xl font-editorial text-[#0A1128] mb-2">Drop a photograph</span>
                <span className="text-[11px] uppercase tracking-widest text-[#0A1128]/40">Maximum size: 4MB</span>
              </button>
            )}
          </div>

          {/* Right: Results Area */}
          <div className="space-y-8">
            {error && (
              <div className="flex items-start gap-4 border border-red-500/30 bg-red-50 p-6">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="border border-[#0A1128]/10 bg-white p-16 text-center">
                <div className="mx-auto mb-6 h-8 w-8 animate-spin rounded-full border border-[#0A1128]/20 border-t-[#0A1128]" />
                <p className="text-2xl font-editorial text-[#0A1128] mb-2">Deconstructing formulation...</p>
                <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/50">Cross-referencing global fragrance databases</p>
              </div>
            )}

            {!isAnalyzing && !result && !error && (
              <div className="border border-[#0A1128]/10 bg-white p-12 lg:p-16">
                <Sparkles className="mb-8 h-6 w-6 text-[#7C3AED]" strokeWidth={1.5} />
                <h2 className="text-4xl font-editorial text-[#0A1128] mb-10">Analysis Capabilities</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    'Visual Identification',
                    'Pyramid Deconstruction',
                    'Tier Classification',
                    'Market Duplicates',
                    'Profile Matching',
                    'Aesthetic Description',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 border-b border-[#0A1128]/10 pb-4">
                      <CheckCircle className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                      <span className="text-sm font-medium text-[#0A1128]/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && !isAnalyzing && (
              <>
                <div className="border border-[#0A1128]/10 bg-white p-10 lg:p-12">
                  <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                    <div>
                      {result.identified && result.brand ? (
                        <>
                          <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/50 mb-2">{result.brand}</p>
                          <h2 className="text-4xl font-editorial text-[#0A1128]">
                            {result.name}
                            {result.concentration && <span className="ml-3 text-lg font-sans font-light tracking-normal text-[#0A1128]/40">{result.concentration}</span>}
                          </h2>
                        </>
                      ) : (
                        <h2 className="text-2xl font-editorial text-[#0A1128]/60">Indiscernible Label</h2>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`border px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold ${tierColors[result.tier]}`}>
                        {tierLabels[result.tier]}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#0A1128]/30">Accuracy: {Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>

                  {result.scentProfile && (
                    <p className="text-[#0A1128]/70 text-lg font-light leading-relaxed mb-8">{result.scentProfile}</p>
                  )}

                  {result.accords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-[#0A1128]/10">
                      {result.accords.map(accord => (
                        <span key={accord} className="border border-[#0A1128]/20 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#0A1128]">
                          {accord}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-[#0A1128]/10 bg-white p-10 lg:p-12">
                  <h3 className="mb-8 text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50">
                    {result.identified ? 'Confirmed Formulation' : 'Estimated Formulation'}
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {(['top', 'middle', 'base'] as const).map(tier => (
                      <div key={tier} className="border border-[#0A1128]/10 p-6 bg-[#F9F8F6]">
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[#0A1128]/40 border-b border-[#0A1128]/10 pb-2">{tier} Notes</p>
                        <div className="flex flex-col gap-2">
                          {(result.notes[tier] || []).map(note => (
                            <span key={note} className="text-sm font-medium text-[#0A1128]">
                              {note}
                            </span>
                          ))}
                          {(result.notes[tier] || []).length === 0 && (
                            <span className="text-sm text-[#0A1128]/30">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.hasDupes && result.dupes.length > 0 && (
                  <div className="border border-[#0A1128]/10 bg-white p-10 lg:p-12">
                    <div className="mb-8 flex flex-col gap-2">
                      <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium">Market Alternatives</span>
                      <h3 className="text-3xl font-editorial text-[#0A1128]">Affordable Duplicates</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {result.dupes.map((dupe, i) => (
                        <a
                          key={i}
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${dupe.brand}${dupe.name} perfume buy`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex flex-col gap-2 border border-[#0A1128]/10 p-6 transition-colors hover:border-[#7C3AED]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-[#0A1128]/50">{dupe.brand}</p>
                              <p className="font-editorial text-lg text-[#0A1128] mt-1 group-hover:text-[#7C3AED] transition-colors">{dupe.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#0A1128]">{dupe.price}</span>
                              <ExternalLink className="h-3 w-3 text-[#0A1128]/20 group-hover:text-[#7C3AED]" />
                            </div>
                          </div>
                          <p className="text-[13px] text-[#0A1128]/60 leading-relaxed mt-2">{dupe.reason}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalyzer;