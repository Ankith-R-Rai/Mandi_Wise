import React from 'react';
import { MARKET_COLORS } from './TrendControls';

export interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  priceUnit?: string;
}

export const CustomChartTooltip: React.FC<CustomChartTooltipProps> = ({
  active,
  payload,
  label,
  priceUnit = '₹/quintal',
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Format date display (e.g., 2026-11-14 -> 14 Nov 2026)
  let formattedDate = label;
  if (label && label.includes('-')) {
    try {
      const d = new Date(label);
      formattedDate = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      formattedDate = label;
    }
  }

  return (
    <div className="bg-[#0A261A]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3.5 shadow-xl text-white text-xs min-w-[200px]">
      <div className="border-b border-emerald-500/20 pb-2 mb-2 flex items-center justify-between">
        <span className="font-semibold text-emerald-200">{formattedDate}</span>
        <span className="text-[10px] text-emerald-400 font-mono">{priceUnit}</span>
      </div>

      <div className="space-y-1.5">
        {payload.map((entry) => {
          if (entry.value === null || entry.value === undefined) return null;
          const color = entry.color || MARKET_COLORS[entry.name] || '#10B981';

          return (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-white/80 font-medium truncate max-w-[130px]">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-white font-mono text-sm">
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
