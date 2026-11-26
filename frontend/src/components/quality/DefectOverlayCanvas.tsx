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
          fill: 'rgba(220, 38, 38, 0.18)',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'moderate':
        return {
          stroke: '#EA580C',
          fill: 'rgba(234, 88, 12, 0.16)',
          badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      case 'minor':
      default:
        return {
          stroke: '#D97706',
          fill: 'rgba(217, 119, 6, 0.14)',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  // Group defects for clean, uncluttered footer summary
  const severeCount = defects.filter((d) => d.severity.toLowerCase() === 'severe').length;
  const moderateCount = defects.filter((d) => d.severity.toLowerCase() === 'moderate').length;
  const minorCount = defects.filter((d) => d.severity.toLowerCase() === 'minor').length;

  return (
    <div className="rounded-2xl border border-surface-border bg-white overflow-hidden shadow-sm transition-all duration-200">
      {/* Overlay Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-background/80 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-darkCharcoal uppercase tracking-wider">
            Visual Defect Detection
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              defects.length === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-forest-lightSage text-forest border-forest/20'
            }`}
          >
            {defects.length === 0 ? 'No Defects Detected' : `${defects.length} Area${defects.length > 1 ? 's' : ''} Flagged`}
          </span>
        </div>

        {defects.length > 0 && (
          <button
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-charcoal hover:text-forest px-3 py-1 rounded-lg border border-surface-border hover:bg-white transition-colors shadow-2xs"
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

      {/* Main Inspection Canvas: Wrapping inline-block so SVG perfectly matches image aspect ratio without letterboxing */}
      <div className="relative w-full bg-slate-950/5 flex items-center justify-center p-3 sm:p-4 select-none min-h-[300px] max-h-[460px] overflow-hidden">
        <div className="relative inline-block max-w-full max-h-[420px] rounded-xl overflow-hidden shadow-sm">
          <img
            src={imageUrl}
            alt={`${vegetableName} visual quality inspection`}
            className="block max-h-[420px] max-w-full w-auto h-auto object-contain mx-auto rounded-xl"
          />

          {showOverlays && defects.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {defects.map((defect, index) => {
                const bbox = defect.bbox_xyxy;
                if (!bbox || bbox.length < 4) return null;

                // Support normalized (0..1) coordinates mapped to 0..100% SVG coordinates
                const isNormalized = Math.max(...bbox) <= 1.0;
                const factor = isNormalized ? 100 : 1;
                const x1 = Math.min(Math.max(bbox[0] * factor, 0), 100);
                const y1 = Math.min(Math.max(bbox[1] * factor, 0), 100);
                const x2 = Math.min(Math.max(bbox[2] * factor, 0), 100);
                const y2 = Math.min(Math.max(bbox[3] * factor, 0), 100);
                const width = Math.max(x2 - x1, 2);
                const height = Math.max(y2 - y1, 2);

                const style = getSeverityStyle(defect.severity);

                return (
                  <g key={`defect-box-${index}`}>
                    {/* Defect Bounding Box */}
                    <rect
                      x={`${x1}%`}
                      y={`${y1}%`}
                      width={`${width}%`}
                      height={`${height}%`}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                      rx="1"
                    />

                    {/* Compact severity indicator tag */}
                    <rect
                      x={`${x1}%`}
                      y={`${Math.max(y1 - 4.5, 0)}%`}
                      width={`${Math.min(Math.max(width * 0.9, 14), 28)}%`}
                      height="4.5%"
                      fill={style.stroke}
                      rx="0.8"
                    />
                    <text
                      x={`${x1 + 1.2}%`}
                      y={`${Math.max(y1 - 1.2, 3.2)}%`}
                      fill="#FFFFFF"
                      fontSize="2.4"
                      fontWeight="bold"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      #{index + 1} {defect.severity.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Defect Summary Footer */}
      {defects.length > 0 ? (
        <div className="p-3 bg-surface-background/50 border-t border-surface-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
                Defects Found:
              </span>
              {severeCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>{severeCount} Severe Lesion{severeCount > 1 ? 's' : ''}</span>
                </span>
              )}
              {moderateCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200">
                  <AlertTriangle className="w-3 h-3 text-orange-600" />
                  <span>{moderateCount} Moderate Spot{moderateCount > 1 ? 's' : ''}</span>
                </span>
              )}
              {minorCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>{minorCount} Minor Blemish{minorCount > 1 ? 'es' : ''}</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-surface-muted">
              Coordinates localized strictly within crop boundary
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Surface clean with zero significant lesions or contour anomalies detected.</span>
        </div>
      )}
    </div>
  );
};
