import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { DefectItem } from '../../types/quality';

interface DefectOverlayCanvasProps {
  imageUrl: string;
  defects: DefectItem[];
  vegetableName: string;
  naturalWidth?: number;
  naturalHeight?: number;
}

export const DefectOverlayCanvas: React.FC<DefectOverlayCanvasProps> = ({
  imageUrl,
  defects,
  vegetableName,
}) => {
  const [showOverlays, setShowOverlays] = useState(true);

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return {
          stroke: '#DC2626',
          fill: 'rgba(220, 38, 38, 0.15)',
          badgeClass: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'moderate':
        return {
          stroke: '#EA580C',
          fill: 'rgba(234, 88, 12, 0.15)',
          badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        };
      case 'minor':
      default:
        return {
          stroke: '#D97706',
          fill: 'rgba(217, 119, 6, 0.12)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-white overflow-hidden shadow-sm">
      {/* Overlay Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-background/80 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
            Visual Defect Detection
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-lightSage text-forest">
            {defects.length === 0 ? 'No Defects Detected' : `${defects.length} Area${defects.length > 1 ? 's' : ''} Flagged`}
          </span>
        </div>

        {defects.length > 0 && (
          <button
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-charcoal hover:text-forest px-2.5 py-1 rounded-lg border border-surface-border hover:bg-white transition-colors"
          >
            {showOverlays ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-surface-muted" />
                <span>Hide Bounding Boxes</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-forest" />
                <span>Show Bounding Boxes</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Preview Container with SVG Overlay */}
      <div className="relative aspect-video max-h-[420px] w-full bg-slate-900 flex items-center justify-center overflow-hidden select-none">
        <img
          src={imageUrl}
          alt={`${vegetableName} visual quality inspection`}
          className="max-h-full max-w-full object-contain"
        />

        {showOverlays && defects.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {defects.map((defect, index) => {
              const bbox = defect.bbox_xyxy;
              if (!bbox || bbox.length < 4) return null;

              // Support normalized (0..1) and pixel values normalized to 100%
              const isNormalized = Math.max(...bbox) <= 1.0;
              const factor = isNormalized ? 100 : 1; // if pixel values, fallback smoothly
              const x1 = Math.min(Math.max(bbox[0] * factor, 0), 100);
              const y1 = Math.min(Math.max(bbox[1] * factor, 0), 100);
              const x2 = Math.min(Math.max(bbox[2] * factor, 0), 100);
              const y2 = Math.min(Math.max(bbox[3] * factor, 0), 100);
              const width = Math.max(x2 - x1, 2);
              const height = Math.max(y2 - y1, 2);

              const style = getSeverityStyle(defect.severity);

              return (
                <g key={`defect-box-${index}`}>
                  <rect
                    x={`${x1}%`}
                    y={`${y1}%`}
                    width={`${width}%`}
                    height={`${height}%`}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    rx="1"
                  />
                  <rect
                    x={`${x1}%`}
                    y={`${Math.max(y1 - 5, 0)}%`}
                    width={`${Math.min(width * 1.5, 30)}%`}
                    height="5%"
                    fill={style.stroke}
                    rx="1"
                  />
                  <text
                    x={`${x1 + 1}%`}
                    y={`${Math.max(y1 - 1.5, 3.5)}%`}
                    fill="#FFFFFF"
                    fontSize="3"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {defect.defect_type.replace(/_/g, ' ')}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Defect Summary Footer Pills */}
      {defects.length > 0 ? (
        <div className="p-3 bg-surface-background/40 border-t border-surface-border">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-bold text-surface-muted uppercase">Detected Anomalies:</span>
            {defects.map((d, i) => {
              const style = getSeverityStyle(d.severity);
              return (
                <span
                  key={`pill-${i}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.badgeClass}`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span className="capitalize">{d.defect_type.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] opacity-75">({d.severity})</span>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Surface clean with zero major visual lesions or contour defects detected.</span>
        </div>
      )}
    </div>
  );
};
