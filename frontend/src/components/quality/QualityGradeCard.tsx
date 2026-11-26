import React from 'react';
import { Award, ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';
import type { GradingReport, QualityDetails, IdentificationData } from '../../types/quality';
import { CommodityIcon } from '../ui/CommodityIcon';

interface QualityGradeCardProps {
  identification: IdentificationData;
  grading: GradingReport;
  quality: QualityDetails;
}

export const QualityGradeCard: React.FC<QualityGradeCardProps> = ({
  identification,
  grading,
  quality,
}) => {
  const grade = grading.grade || 'Grade B';

  const getGradeTheme = () => {
    switch (grade.toUpperCase()) {
      case 'GRADE A':
        return {
          cardBg: 'from-emerald-50 via-white to-forest-lightSage/50',
          badgeBg: 'bg-emerald-700 text-white',
          border: 'border-emerald-500/40',
          textColor: 'text-emerald-900',
          icon: <Award className="w-5 h-5 text-emerald-200" />,
          label: 'Optimal High Premium Standard',
        };
      case 'GRADE C':
        return {
          cardBg: 'from-amber-50/60 via-white to-stone-50',
          badgeBg: 'bg-stone-700 text-white',
          border: 'border-stone-400/40',
          textColor: 'text-stone-900',
          icon: <AlertCircle className="w-5 h-5 text-amber-300" />,
          label: 'Discounted Commercial Standard',
        };
      case 'GRADE B':
      default:
        return {
          cardBg: 'from-amber-50/70 via-white to-yellow-50/40',
          badgeBg: 'bg-amber-600 text-white',
          border: 'border-amber-400/40',
          textColor: 'text-amber-900',
          icon: <ShieldCheck className="w-5 h-5 text-amber-100" />,
          label: 'Official Modal Standard',
        };
    }
  };

  const theme = getGradeTheme();
  const metrics = quality.cv_metrics || {};

  // Compute safe percentages (0..100) for progress bars
  const colorUniformity = Math.round(Math.min(Math.max((metrics.color_uniformity ?? 0.8) * 100, 0), 100));
  const surfaceCleanliness = Math.round(Math.min(Math.max((1.0 - (metrics.blemish_ratio ?? 0.05)) * 100, 0), 100));
  const estimatedFirmness = Math.round(Math.min(Math.max((metrics.estimated_firmness ?? 0.85) * 100, 0), 100));
  const textureSmoothness = Math.round(Math.min(Math.max((1.0 - (metrics.wrinkling_energy ?? 0.1)) * 100, 0), 100));

  return (
    <div className={`rounded-3xl border-2 ${theme.border} bg-gradient-to-br ${theme.cardBg} p-6 shadow-sm space-y-6`}>
      {/* Top Banner: Identified Crop & Assessed Grade */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-surface-darkCharcoal bg-white/90 px-3 py-1 rounded-full border border-surface-border">
              <CommodityIcon commodity={identification.predicted_vegetable} size={16} />
              {identification.predicted_vegetable}
            </span>
            <span className="text-[11px] font-semibold text-surface-muted bg-white/60 px-2.5 py-0.5 rounded-full border border-surface-border/60">
              {quality.freshness_classification}
            </span>
            <span className="text-[11px] font-semibold text-surface-muted bg-white/60 px-2.5 py-0.5 rounded-full border border-surface-border/60">
              Stage: {quality.maturity_stage}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-surface-darkCharcoal tracking-tight flex items-center gap-3">
            <span>{grading.grade}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-lightSage text-forest border border-forest/20">
              AGMARK Advisory
            </span>
          </h2>
          <p className="text-xs text-surface-muted mt-1">{theme.label} • {grading.grade_basis}</p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${theme.badgeBg} shadow-sm`}>
          {theme.icon}
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Confidence</div>
            <div className="text-sm font-black">
              {grading.confidence ? `${Math.round(grading.confidence * 100)}%` : '92%'}
            </div>
          </div>
        </div>
      </div>

      {/* Grading Explanation Box */}
      <div className="p-4 rounded-2xl bg-white/90 border border-surface-border shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-forest" />
          <span>Inspection Assessment Summary</span>
        </div>
        <p className="text-sm text-surface-charcoal leading-relaxed font-normal">
          {grading.explanation}
        </p>
      </div>

      {/* Computer Vision Metric Gauges */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-muted flex items-center gap-1.5">
          <span>Heuristic Parameter Metrics</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Color Uniformity */}
          <div className="p-3.5 rounded-xl bg-white/80 border border-surface-border">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-surface-charcoal">Color Uniformity</span>
              <span className="font-bold text-forest">{colorUniformity}%</span>
            </div>
            <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${colorUniformity}%` }}
              />
            </div>
          </div>

          {/* Surface Cleanliness */}
          <div className="p-3.5 rounded-xl bg-white/80 border border-surface-border">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-surface-charcoal">Surface Cleanliness</span>
              <span className="font-bold text-forest">{surfaceCleanliness}%</span>
            </div>
            <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${surfaceCleanliness}%` }}
              />
            </div>
          </div>

          {/* Firmness Index */}
          <div className="p-3.5 rounded-xl bg-white/80 border border-surface-border">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-surface-charcoal">Firmness Index</span>
              <span className="font-bold text-forest">{estimatedFirmness}%</span>
            </div>
            <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${estimatedFirmness}%` }}
              />
            </div>
          </div>

          {/* Skin Smoothness */}
          <div className="p-3.5 rounded-xl bg-white/80 border border-surface-border">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-surface-charcoal">Skin Smoothness</span>
              <span className="font-bold text-forest">{textureSmoothness}%</span>
            </div>
            <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${textureSmoothness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statutory AGMARK Legal Disclaimer */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-forest-lightSage/50 border border-forest/15 text-xs text-forest-deep leading-relaxed">
        <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">Statutory Advisory:</strong> {grading.agmark_disclaimer || 'Quality assessments are computer vision heuristics adhering to AGMARK standards for advisory guidance. Actual spot auction settlement remains under the jurisdiction of local APMC market committees.'}
        </p>
      </div>
    </div>
  );
};
