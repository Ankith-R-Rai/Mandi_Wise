import React, { useEffect, useState } from 'react';
import { MarketPriceExplorer } from '../components/market/MarketPriceExplorer';
import { MarketPriceTicker } from '../components/hero/MarketPriceTicker';
import { BarChart3, ShieldCheck } from 'lucide-react';

export const MarketPricesPage: React.FC = () => {
  const [selectedTickerItem, setSelectedTickerItem] = useState<{ commodity: string; market: string } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#EDF5F0] pt-24 pb-20 text-surface-charcoal">
      {/* Ticker Ribbon */}
      <div className="w-full mb-8 pt-4">
        <MarketPriceTicker
          onSelectRecord={(record) => {
            setSelectedTickerItem(record);
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-900/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-lightSage border border-forest-sage text-forest text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
              <BarChart3 className="w-4 h-4" />
              Real-Time Market Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-darkCharcoal tracking-tight">
              Karnataka APMC Mandi Market Prices
            </h1>
            <p className="text-sm sm:text-base text-surface-muted mt-1.5 max-w-2xl">
              Official modal prices, min-max spreads, and 3-tier freshness verification across Karnataka agricultural markets.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-surface-charcoal bg-white p-3.5 rounded-2xl border border-emerald-900/10 shadow-xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-forest-fresh shrink-0" />
            <span className="font-semibold">Official AGMARKNET &amp; data.gov.in Feeds</span>
          </div>
        </div>

        {/* Explorer Component */}
        <MarketPriceExplorer
          selectedMandiRecord={selectedTickerItem}
          onClearSelectedMandi={() => setSelectedTickerItem(null)}
        />
      </div>
    </div>
  );
};
