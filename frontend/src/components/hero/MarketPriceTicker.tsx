import React from 'react';
import { Badge } from '../ui/Badge';
import { CANONICAL_MANDI_RECORDS, type CanonicalPriceRecord } from '../../data/canonicalMandiData';
import { cn } from '../../utils/cn';

export interface MarketPriceTickerProps {
  onSelectRecord?: (record: CanonicalPriceRecord) => void;
  className?: string;
}

const commodityIcons: Record<string, string> = {
  Tomato: '🍅',
  Onion: '🧅',
  Potato: '🥔',
};

export const MarketPriceTicker: React.FC<MarketPriceTickerProps> = ({
  onSelectRecord,
  className,
}) => {
  // Use fresh records for the live ticker ribbon
  const tickerRecords = CANONICAL_MANDI_RECORDS.filter(
    (r) => r.freshness_status === 'FRESH'
  );

  return (
    <div
      className={cn(
        'w-full bg-white/95 backdrop-blur-md border border-surface-border rounded-xl shadow-sm overflow-hidden py-2.5 px-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Ticker Lead Label */}
        <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-surface-border">
          <span className="inline-block w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest">
            Karnataka APMC Live Feed
          </span>
        </div>

        {/* Ticker Scroll Items Container */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {tickerRecords.map((item, index) => {
            const icon = commodityIcons[item.commodity] || '🌾';
            const formattedPrice = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(item.modal_price);

            return (
              <button
                key={`${item.commodity}-${item.market}-${index}`}
                onClick={() => onSelectRecord?.(item)}
                className={cn(
                  'flex items-center gap-2 shrink-0 text-left py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer select-none',
                  'hover:bg-forest-lightSage/90 hover:scale-105 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest text-xs'
                )}
              >
                <span className="text-base select-none">{icon}</span>

                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-surface-darkCharcoal">
                    <span>{item.commodity}</span>
                    <span className="text-[11px] font-normal text-surface-muted">
                      ({item.variety})
                    </span>
                    <span className="text-surface-muted">&bull;</span>
                    <span className="text-forest font-medium">{item.market}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-surface-charcoal">
                      {formattedPrice}
                      <span className="text-[10px] font-normal text-surface-muted ml-0.5">
                        /quintal
                      </span>
                    </span>

                    <Badge
                      variant={item.freshness_status === 'FRESH' ? 'fresh' : 'acceptable'}
                      size="sm"
                      dot={false}
                    >
                      {item.observation_date}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
