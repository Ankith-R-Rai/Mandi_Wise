import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { TrendControls } from './TrendControls';
import { PriceStatsCards } from './PriceStatsCards';
import { PriceTrendChart } from './PriceTrendChart';
import { HistoricalDataTable } from './HistoricalDataTable';
import { Button } from '../ui/Button';
import { trendsService } from '../../services/trendsService';
import type { PriceTrendResponse, DateRangePreset } from '../../types/trends';

const DEFAULT_MARKETS = [
  'Kolar',
  'Bengaluru (Yeshwanthpur)',
  'Hubli (Amaragol)',
  'Belagavi',
  'Mysuru (Bandipalya)',
  'Davanagere',
];

const RANGE_LABELS: Record<DateRangePreset, string> = {
  '7d': '7-Day',
  '30d': '30-Day',
  '90d': '90-Day',
  '1y': '1-Year',
  'all': 'All-Time',
};

export const PriceTrendsDashboard: React.FC = () => {
  const [commodity, setCommodity] = useState('Tomato');
  const [range, setRange] = useState<DateRangePreset>('30d');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    'Kolar',
    'Bengaluru (Yeshwanthpur)',
  ]);
  const [focusedMarket, setFocusedMarket] = useState<string>('Kolar');

  const [data, setData] = useState<PriceTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await trendsService.getHistoricalTrends({
        commodity,
        range,
        markets: selectedMarkets,
      });
      setData(res);

      // If focused market is not in the response stats, default to first available
      if (res.stats && !res.stats[focusedMarket]) {
        const first = Object.keys(res.stats)[0];
        if (first) setFocusedMarket(first);
      }
    } catch (err: any) {
      console.error('Failed to load price trends:', err);
      setError(err?.message || 'Unable to connect to market trend server. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  }, [commodity, range, selectedMarkets, focusedMarket]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  const handleToggleMarket = (market: string) => {
    setSelectedMarkets((prev) => {
      if (prev.includes(market)) {
        if (prev.length === 1) return prev; // Keep at least 1 market active
        const next = prev.filter((m) => m !== market);
        if (focusedMarket === market) {
          setFocusedMarket(next[0] || 'Kolar');
        }
        return next;
      } else {
        return [...prev, market];
      }
    });
  };

  const handleSelectCommodity = (newCommodity: string) => {
    setCommodity(newCommodity);
    // If commodity changed, adjust initial default focused markets appropriately
    if (newCommodity.toLowerCase() === 'onion') {
      setSelectedMarkets(['Hubli (Amaragol)', 'Bengaluru (Yeshwanthpur)']);
      setFocusedMarket('Hubli (Amaragol)');
    } else if (newCommodity.toLowerCase() === 'potato') {
      setSelectedMarkets(['Belagavi', 'Mysuru (Bandipalya)']);
      setFocusedMarket('Belagavi');
    } else {
      setSelectedMarkets(['Kolar', 'Bengaluru (Yeshwanthpur)']);
      setFocusedMarket('Kolar');
    }
  };

  const activeStats = data?.stats?.[focusedMarket] || (data?.stats ? Object.values(data.stats)[0] : undefined);
  const rangeLabel = RANGE_LABELS[range] || '30-Day';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-lightSage border border-forest-sage/40 text-forest text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Official Karnataka Mandi Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-darkCharcoal tracking-tight">
            Historical Price Trends
          </h1>
          <p className="text-xs sm:text-sm text-surface-muted mt-1 max-w-2xl">
            Analyze modal price trajectories, compare inter-mandi spreads, and detect seasonal price peaks across APMC markets.
          </p>
        </div>

        {/* Refresh Action */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchTrends}
            disabled={isLoading}
            className="rounded-xl border-forest-sage/40 hover:bg-forest-lightSage/50 text-forest font-bold gap-2 text-xs shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Trends</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTrends}
            className="font-bold underline hover:no-underline text-rose-900 ml-4 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Interactive Trend Controls */}
      <TrendControls
        selectedCommodity={commodity}
        onSelectCommodity={handleSelectCommodity}
        selectedRange={range}
        onSelectRange={setRange}
        availableMarkets={DEFAULT_MARKETS}
        selectedMarkets={selectedMarkets}
        onToggleMarket={handleToggleMarket}
        focusedMarket={focusedMarket}
        onSelectFocusedMarket={setFocusedMarket}
      />

      {/* Summary KPI Stats Cards */}
      <PriceStatsCards
        stats={activeStats}
        marketName={focusedMarket}
        rangeLabel={rangeLabel}
      />

      {/* Interactive Recharts Visualization */}
      <PriceTrendChart
        series={data?.series || []}
        selectedMarkets={selectedMarkets}
        commodityName={commodity}
        priceUnit="₹/quintal"
        isLoading={isLoading}
      />

      {/* Detailed Historical Records Table */}
      <HistoricalDataTable
        series={data?.series || []}
        commodityName={commodity}
        priceUnit="INR_PER_QUINTAL"
      />
    </div>
  );
};
