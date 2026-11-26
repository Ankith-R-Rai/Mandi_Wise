import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, RefreshCw, Sparkles, Check } from 'lucide-react';
import { CommodityIcon } from '../ui/CommodityIcon';

interface ImageDropzoneProps {
  onImageSelected: (file: File, hint?: string) => void;
  selectedCropHint: string;
  onCropHintChange: (crop: string) => void;
  supportedCrops: string[];
  isAnalyzing: boolean;
  currentPreviewUrl: string | null;
  onReset: () => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelected,
  selectedCropHint,
  onCropHintChange,
  supportedCrops,
  isAnalyzing,
  currentPreviewUrl,
  onReset,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file, selectedCropHint || undefined);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelected(files[0], selectedCropHint || undefined);
    }
  };

  return (
    <div className="space-y-5">
      {/* Crop Selector Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-surface-muted mb-2">
          Select Crop Classification (Optional Auto-Detect Available)
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCropHintChange('')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCropHint === ''
                ? 'bg-forest text-white shadow-sm ring-2 ring-forest/20'
                : 'bg-white text-surface-charcoal border border-surface-border hover:bg-forest-lightSage/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Detect
          </button>
          {supportedCrops.map((crop) => {
            const isSelected = selectedCropHint.toLowerCase() === crop.toLowerCase();
            return (
              <button
                key={crop}
                type="button"
                onClick={() => onCropHintChange(crop)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-forest text-white shadow-sm ring-2 ring-forest/20'
                    : 'bg-white text-surface-charcoal border border-surface-border hover:bg-forest-lightSage/50'
                }`}
              >
                <CommodityIcon commodity={crop} size={15} />
                <span>{crop}</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-200" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden native inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Zone or Preview */}
      {currentPreviewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-forest/30 bg-black/5 p-2">
          <div className="flex items-center justify-between p-3 bg-white/90 backdrop-blur rounded-xl border border-surface-border mb-2">
            <span className="text-xs font-semibold text-surface-darkCharcoal flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Photo loaded for computer vision inspection
            </span>
            <button
              type="button"
              onClick={onReset}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-forest hover:text-forest-deep px-2.5 py-1 rounded-lg hover:bg-forest-lightSage transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragOver
              ? 'border-forest bg-forest-lightSage/60 scale-[1.01]'
              : 'border-surface-border hover:border-forest/60 bg-surface-background/50 hover:bg-forest-lightSage/20'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-lightSage text-forest mb-4 shadow-sm">
            <UploadCloud className="h-7 w-7 text-forest" />
          </div>

          <h3 className="text-base font-bold text-surface-darkCharcoal mb-1">
            Upload Harvest Photo for Quality Assessment
          </h3>
          <p className="text-xs text-surface-muted max-w-sm mx-auto mb-5">
            Drag and drop your crop photo here, or browse files from your smartphone or computer (JPG, PNG).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold shadow hover:bg-forest-deep transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Browse Gallery
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-surface-border text-surface-charcoal text-xs font-bold shadow-sm hover:bg-surface-background transition-colors"
            >
              <Camera className="w-4 h-4 text-forest" />
              Capture with Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
