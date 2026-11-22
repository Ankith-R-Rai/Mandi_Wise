import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Activity, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import type { PriceTrendStats } from '../../types/trends';

export interface PriceStatsCardsProps {
  stats?: PriceTrendStats;
  marketName: string;
  rangeLabel: string;
}

export const PriceStatsCards: React.FC<PriceStatsCardsProps> = ({
  stats,
  marketName,
  rangeLabel,
}) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-forest-sage/20 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const isPositive = stats.percentageChange > 0;
  const isNegative = stats.percentageChange < 0;
  const isNeutral = stats.percentageChange === 0;

  const spread = stats.periodHigh - stats.periodLow;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Latest Modal Price */}
      <Card className="p-4 rounded-2xl bg-white/95 border border-forest-sage/30 shadow-xs hover:border-forest/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-surface-muted uppercase tracking-wider">
            Latest Rate
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-forest font-semibold border border-emerald-200">
            {marketName}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-forest tracking-tight">
            ₹{stats.latestModalPrice.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-surface-muted">/q</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
          {isPositive && (
            <span className="flex items-center text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +{stats.percentageChange.toFixed(1)}%
            </span>
          )}
          {isNegative && (
            <span className="flex items-center text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              {stats.percentageChange.toFixed(1)}%
            </span>
          )}
          {isNeutral && (
            <span className="flex items-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              <Minus className="w-3.5 h-3.5 mr-1" />
              0.0%
            </span>
          )}
          <span className="text-[11px] text-surface-muted">vs period start</span>
        </div>
      </Card>

      {/* Period High */}
      <Card className="p-4 rounded-2xl bg-white/95 border border-forest-sage/30 shadow-xs hover:border-forest/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-surface-muted uppercase tracking-wider">
            {rangeLabel} High
          </span>
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-surface-darkCharcoal tracking-tight">
            ₹{stats.periodHigh.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-surface-muted">/q</span>
        </div>
        <p className="mt-2 text-[11px] text-surface-muted flex items-center gap-1">
          <Calendar className="w-3 h-3 text-forest-sage" />
          <span>Peak seasonal pricing</span>
        </p>
      </Card>

      {/* Period Low */}
      <Card className="p-4 rounded-2xl bg-white/95 border border-forest-sage/30 shadow-xs hover:border-forest/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-surface-muted uppercase tracking-wider">
            {rangeLabel} Low
          </span>
          <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center">
            <ArrowDownRight className="w-3.5 h-3.5 text-amber-700" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-surface-darkCharcoal tracking-tight">
            ₹{stats.periodLow.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-surface-muted">/q</span>
        </div>
        <p className="mt-2 text-[11px] text-surface-muted flex items-center gap-1">
          <Activity className="w-3 h-3 text-forest-sage" />
          <span>Spread ₹{spread.toLocaleString()}/q</span>
        </p>
      </Card>

      {/* Period Average */}
      <Card className="p-4 rounded-2xl bg-white/95 border border-forest-sage/30 shadow-xs hover:border-forest/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-surface-muted uppercase tracking-wider">
            {rangeLabel} Average
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {stats.observationCount} Records
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-surface-darkCharcoal tracking-tight">
            ₹{stats.periodAverage.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-surface-muted">/q</span>
        </div>
        <p className="mt-2 text-[11px] text-surface-muted">
          Weighted modal rate baseline
        </p>
      </Card>
    </div>
  );
};
