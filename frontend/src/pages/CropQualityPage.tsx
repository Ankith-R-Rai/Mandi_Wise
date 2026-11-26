import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, AlertCircle, RefreshCw, Eye, CheckCircle2, Award, Truck } from 'lucide-react';
import { qualityService } from '../services/qualityService';
import type { QualityAnalysisResponse, SupportedCrop } from '../types/quality';
import { ImageDropzone } from '../components/quality/ImageDropzone';
import { DefectOverlayCanvas } from '../components/quality/DefectOverlayCanvas';
import { QualityGradeCard } from '../components/quality/QualityGradeCard';
import { WorkflowTransitionBanner } from '../components/quality/WorkflowTransitionBanner';

const DEFAULT_SUPPORTED_CROPS = ['Tomato', 'Potato', 'Onion', 'Brinjal', 'Green Chilli'];

export const CropQualityPage: React.FC = () => {
  const [selectedCropHint, setSelectedCropHint] = useState<string>('');
  const [supportedCrops, setSupportedCrops] = useState<string[]>(DEFAULT_SUPPORTED_CROPS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<QualityAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load supported crops catalog from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchCrops() {
      try {
        const crops = await qualityService.getSupportedCrops();
        if (isMounted && crops && crops.length > 0) {
          setSupportedCrops(crops.map((c: SupportedCrop) => c.name));
        }
      } catch (err) {
        // Fall back to default crop list gracefully if backend proxy is starting up
        console.warn('Using default supported crops list:', err);
      }
    }
    fetchCrops();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageSelected = async (file: File, hint?: string) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await qualityService.analyzeImage(file, hint);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Quality assessment failed:', err);
      setError(
        err.message ||
          'Unable to complete image quality inspection. Please ensure the vision microservice is running or try a clearer photo.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-background text-surface-charcoal pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-lightSage border border-forest-sage text-forest text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-forest" />
            Computer Vision Quality Grading
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-surface-darkCharcoal tracking-tight">
            AgriVision Crop Quality Assessment
          </h1>
          <p className="text-sm sm:text-base text-surface-muted mt-1.5 max-w-2xl">
            Upload or photograph your harvest. MandiWise measures color uniformity, skin firmness, surface blemishes, and contour defects to benchmark AGMARK Grade A, B, or C standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-surface-charcoal bg-white p-3 rounded-2xl border border-emerald-900/10 shadow-xs self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">AGMARK Visual Standards Compliant</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Inspection Service Notice</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => selectedFile && handleImageSelected(selectedFile, selectedCropHint)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Dropzone & Defect Canvas */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm">
            <ImageDropzone
              onImageSelected={handleImageSelected}
              selectedCropHint={selectedCropHint}
              onCropHintChange={setSelectedCropHint}
              supportedCrops={supportedCrops}
              isAnalyzing={isAnalyzing}
              currentPreviewUrl={previewUrl}
              onReset={handleReset}
            />
          </div>

          {previewUrl && (
            <DefectOverlayCanvas
              imageUrl={previewUrl}
              defects={analysisResult?.defects || []}
              vegetableName={analysisResult?.identification?.predicted_vegetable || selectedCropHint || 'Harvest'}
            />
          )}
        </div>

        {/* Right Column: Results or Educational Placeholder */}
        <div className="lg:col-span-6 space-y-6">
          {isAnalyzing ? (
            <div className="rounded-3xl border-2 border-forest/20 bg-white p-12 text-center shadow-sm space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-forest-lightSage flex items-center justify-center text-forest">
                <RefreshCw className="w-8 h-8 animate-spin text-forest" />
              </div>
              <h3 className="text-lg font-bold text-surface-darkCharcoal">
                Inspecting Crop Specimen...
              </h3>
              <p className="text-xs text-surface-muted max-w-md mx-auto leading-relaxed">
                Applying OpenCV CLAHE illumination normalization, LAB color distribution profiling, Sobel texture gradient analysis, and AGMARK defect threshold checking.
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6 animate-fade-in">
              <QualityGradeCard
                identification={analysisResult.identification}
                grading={analysisResult.grading}
                quality={analysisResult.quality}
              />

              <WorkflowTransitionBanner
                cropName={analysisResult.identification.predicted_vegetable}
                grade={analysisResult.grading.grade}
              />
            </div>
          ) : (
            /* Educational Placeholder Before Upload */
            <div className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest-lightSage flex items-center justify-center text-forest font-bold">
                  <Award className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-darkCharcoal">
                    Why Quality Grading Shapes Farmer Profit
                  </h3>
                  <p className="text-xs text-surface-muted">
                    Grading precision prevents transport loss and commands premium APMC auction bids.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-background/60 border border-surface-border flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
                      Grade A Price Optimization
                    </h4>
                    <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                      Grade A harvest commands the highest mandi price ceiling (<span className="font-semibold text-emerald-800">max_price</span>). MandiWise factors this premium into net take-home calculations.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background/60 border border-surface-border flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
                      Prevent Freight Waste on Grade C
                    </h4>
                    <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                      Sub-optimal Grade C produce risks transit spoilage over long distances. MandiWise benchmarks Grade C at minimum floor prices to warn against unprofitable freight expenses.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background/60 border border-surface-border flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-800 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
                      Transparent Computer Vision Metrics
                    </h4>
                    <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                      Color uniformity, blemish ratios, and skin firmness are quantified objectively, eliminating trader exploitation and unfair lot downgrading at the mandi gate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
