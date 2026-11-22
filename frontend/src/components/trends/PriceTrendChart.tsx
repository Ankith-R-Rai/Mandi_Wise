import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Layers, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Tooltip as UiTooltip } from '../ui/Tooltip';
import { CustomChartTooltip } from './CustomChartTooltip';
import { MARKET_COLORS } from './TrendControls';
import type { MarketTrendSeries } from '../../types/trends';

export interface PriceTrendChartProps {
  series: MarketTrendSeries[];
  selectedMarkets: string[];
  commodityName: string;
  priceUnit?: string;
  isLoading?: boolean;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  series,
  selectedMarkets,
  commodityName,
  priceUnit = '₹/quintal',
  isLoading = false,
}) => {
  const [metricMode, setMetricMode] = useState<'modal' | 'range'>('modal');

  // Filter series to only selected markets
  const activeSeries = useMemo(() => {
    return series.filter((s) => selectedMarkets.includes(s.marketName));
  }, [series, selectedMarkets]);

  // Aggregate time series into chronological records for Recharts
  const chartData = useMemo(() => {
    const dateMap: Record<string, any> = {};

    activeSeries.forEach((s) => {
      s.dataPoints.forEach((pt) => {
        const d = pt.observationDate;
        if (!dateMap[d]) {
          dateMap[d] = {
            date: d,
            displayDate: formatDisplayDate(d),
          };
        }
        dateMap[d][s.marketName] = pt.modalPrice;
        dateMap[d][`${s.marketName}_min`] = pt.minPrice;
        dateMap[d][`${s.marketName}_max`] = pt.maxPrice;
      });
    });

    const sorted = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
    return sorted;
  }, [activeSeries]);

  // Determine min and max Y-axis bounds
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [1000, 3000];
    let min = Infinity;
    let max = -Infinity;

    chartData.forEach((row) => {
      activeSeries.forEach((s) => {
        const val = row[s.marketName];
        if (typeof val === 'number') {
          if (val < min) min = val;
          if (val > max) max = val;
        }
      });
    });

    if (min === Infinity) return [1000, 3000];
    const padding = 150;
    return [Math.max(0, Math.floor((min - padding) / 100) * 100), Math.ceil((max + padding) / 100) * 100];
  }, [chartData, activeSeries]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/95 rounded-2xl border border-forest-sage/30 shadow-xs mb-6">
        <div className="h-80 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-forest border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-surface-muted uppercase tracking-wider">
            Loading Price Trends...
          </span>
        </div>
      </Card>
    );
  }

  if (activeSeries.length === 0 || chartData.length === 0) {
    return (
      <Card className="p-8 bg-white/95 rounded-2xl border border-forest-sage/30 shadow-xs mb-6 text-center">
        <div className="max-w-md mx-auto py-8">
          <TrendingUp className="w-10 h-10 text-forest-sage mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-surface-darkCharcoal mb-1">
            No Mandi Trends to Display
          </h3>
          <p className="text-xs text-surface-muted mb-4">
            Select one or more APMC mandis above to visualize price movements over time.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6 bg-white/95 rounded-2xl border border-forest-sage/30 shadow-xs mb-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-surface-darkCharcoal tracking-tight">
              {commodityName} Modal Price Trends
            </h2>
            <UiTooltip text="Tracks official AGMARKNET & data.gov.in modal daily clearing rates across Karnataka mandis.">
              <HelpCircle className="w-4 h-4 text-forest-sage cursor-pointer" />
            </UiTooltip>
          </div>
          <p className="text-xs text-surface-muted mt-0.5">
            Comparing {activeSeries.length} Karnataka APMC mandis over time
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center p-1 bg-forest-lightSage/50 border border-forest-sage/40 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('modal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metricMode === 'modal'
                ? 'bg-white text-forest shadow-xs font-extrabold'
                : 'text-surface-charcoal hover:text-forest'
            }`}
          >
            Modal Rates
          </button>
          <button
            onClick={() => setMetricMode('range')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metricMode === 'range'
                ? 'bg-white text-forest shadow-xs font-extrabold'
                : 'text-surface-charcoal hover:text-forest'
            }`}
          >
            Spread (Min - Max)
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(v) => `₹${v}`}
              dx={-5}
            />
            <Tooltip
              content={<CustomChartTooltip priceUnit={priceUnit} />}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px', fontWeight: 600 }}
            />

            {/* Active Market Lines */}
            {activeSeries.map((s) => {
              const color = MARKET_COLORS[s.marketName] || '#059669';

              return (
                <Line
                  key={s.marketName}
                  type="monotone"
                  dataKey={s.marketName}
                  name={s.marketName}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: color, strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
                  connectNulls={false} // Strict FR-041 compliance: missing dates do NOT plunge to zero
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-3 border-t border-forest-sage/20 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-surface-muted gap-2">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-forest-fresh" />
          <span>Strict FR-041 compliance: non-trading days show line breaks rather than artificial zero values.</span>
        </div>
        <span className="font-mono">All prices standardized to INR / Quintal</span>
      </div>
    </Card>
  );
};

function formatDisplayDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} ${months[monthIdx] || ''}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}
