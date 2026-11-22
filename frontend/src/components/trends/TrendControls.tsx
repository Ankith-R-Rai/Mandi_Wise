import React from 'react';
import { CommodityIcon } from '../ui/CommodityIcon';
import { cn } from '../../utils/cn';
import type { DateRangePreset } from '../../types/trends';

export interface TrendControlsProps {
  selectedCommodity: string;
  onSelectCommodity: (commodity: string) => void;
  selectedRange: DateRangePreset;
  onSelectRange: (range: DateRangePreset) => void;
  availableMarkets: string[];
  selectedMarkets: string[];
  onToggleMarket: (market: string) => void;
  focusedMarket: string;
  onSelectFocusedMarket: (market: string) => void;
}

const COMMODITIES = [
  { name: 'Tomato', label: 'Tomato', kannada: 'ಟೊಮೆಟೊ' },
  { name: 'Onion', label: 'Onion', kannada: 'ಈರುಳ್ಳಿ' },
  { name: 'Potato', label: 'Potato', kannada: 'ಆಲೂಗಡ್ಡೆ' },
];

const RANGES: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
];

// Market color indicators matching chart series
export const MARKET_COLORS: Record<string, string> = {
  'Kolar': '#047857', // Forest Emerald
  'Bengaluru (Yeshwanthpur)': '#D97706', // Golden Amber
  'Hubli (Amaragol)': '#0284C7', // Sky Blue
  'Belagavi': '#7C3AED', // Violet
  'Mysuru (Bandipalya)': '#0D9488', // Teal
  'Davanagere': '#E11D48', // Rose
};

export const TrendControls: React.FC<TrendControlsProps> = ({
  selectedCommodity,
  onSelectCommodity,
  selectedRange,
  onSelectRange,
  availableMarkets,
  selectedMarkets,
  onToggleMarket,
  focusedMarket,
  onSelectFocusedMarket,
}) => {
  return (
    <div className="bg-white/95 rounded-2xl p-5 border border-forest-sage/30 shadow-xs mb-6 space-y-5">
      {/* Top Row: Commodity Selector + Date Range Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Commodity Selector Buttons */}
        <div>
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider block mb-2">
            Select Commodity
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {COMMODITIES.map((c) => {
              const active = selectedCommodity.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  onClick={() => onSelectCommodity(c.name)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-2xs cursor-pointer',
                    active
                      ? 'bg-forest text-white border-forest shadow-emerald-900/10 scale-[1.02]'
                      : 'bg-white hover:bg-forest-lightSage/50 text-surface-charcoal border-forest-sage/40 hover:border-forest/40'
                  )}
                >
                  <CommodityIcon commodity={c.name} size={18} />
                  <span>{c.label}</span>
                  <span className={cn('text-[11px] font-normal', active ? 'text-emerald-200' : 'text-surface-muted')}>
                    ({c.kannada})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Selector Pills */}
        <div>
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider block mb-2">
            Time Window
          </span>
          <div className="inline-flex items-center p-1 bg-forest-lightSage/50 border border-forest-sage/40 rounded-xl">
            {RANGES.map((r) => {
              const active = selectedRange === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => onSelectRange(r.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                    active
                      ? 'bg-white text-forest shadow-xs font-extrabold'
                      : 'text-surface-charcoal hover:text-forest'
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-forest-sage/20" />

      {/* Bottom Row: Multi-Mandi Comparison Selector */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider">
            Compare APMC Mandis (Click to toggle comparison lines)
          </span>
          <span className="text-[11px] text-surface-muted font-medium">
            Active in chart: <strong>{selectedMarkets.length}</strong> of {availableMarkets.length} mandis
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {availableMarkets.map((m) => {
            const isSelected = selectedMarkets.includes(m);
            const isFocused = focusedMarket === m;
            const marketColor = MARKET_COLORS[m] || '#059669';

            return (
              <div
                key={m}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none shadow-2xs',
                  isSelected
                    ? 'bg-white border-forest/30 text-surface-darkCharcoal'
                    : 'bg-slate-50/60 border-slate-200 text-surface-muted opacity-60 hover:opacity-100'
                )}
                onClick={() => onToggleMarket(m)}
              >
                {/* Color Dot */}
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full shrink-0 transition-transform',
                    isSelected ? 'scale-100' : 'scale-75 opacity-40'
                  )}
                  style={{ backgroundColor: marketColor }}
                />

                <span className={cn('font-semibold', isSelected ? 'text-surface-darkCharcoal' : 'text-surface-muted')}>
                  {m}
                </span>

                {/* Primary market indicator */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFocusedMarket(m);
                    }}
                    title="Focus stat cards on this market"
                    className={cn(
                      'ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-all',
                      isFocused
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-forest hover:bg-emerald-100'
                    )}
                  >
                    {isFocused ? 'Primary' : 'Set Primary'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
