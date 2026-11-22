import React, { useEffect } from 'react';
import { PriceTrendsDashboard } from '../components/trends/PriceTrendsDashboard';
import { MarketPriceTicker } from '../components/hero/MarketPriceTicker';

export const PriceTrendsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#EDF5F0] pt-24 pb-20 text-surface-charcoal">
      {/* Live Market Price Ticker Ribbon */}
      <div className="w-full mb-6 pt-2">
        <MarketPriceTicker />
      </div>

      {/* Main Trends Dashboard */}
      <PriceTrendsDashboard />
    </div>
  );
};
