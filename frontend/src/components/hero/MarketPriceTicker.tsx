import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { CommodityIcon } from '../ui/CommodityIcon';
import { marketService } from '../../services/marketService';
import type { MarketPrice } from '../../types/market';
import { cn } from '../../utils/cn';

export interface MarketPriceTickerProps {
  onSelectRecord?: (record: { commodity: string; market: string }) => void;
  className?: string;
}

export const MarketPriceTicker: React.FC<MarketPriceTickerProps> = ({
  onSelectRecord,
  className,
}) => {
  const [tickerItems, setTickerItems] = useState<MarketPrice[]>([]);

  useEffect(() => {
    let isMounted = true;
    marketService.getPrices().then((records) => {
      if (isMounted && records && records.length > 0) {
        // Prefer fresh items for the active ribbon
        const fresh = records.filter((r) => r.freshnessStatus === 'FRESH');
        setTickerItems(fresh.length > 0 ? fresh : records);
      }
    }).catch((err) => {
      console.warn('Ticker could not load live prices, using fallback cache:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
          {tickerItems.map((item, index) => {
            const formattedPrice = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(item.modalPrice);

            return (
              <button
                key={`${item.commodityName}-${item.marketName}-${index}`}
                onClick={() =>
                  onSelectRecord?.({
                    commodity: item.commodityName,
                    market: item.marketName,
                  })
                }
                className={cn(
                  'flex items-center gap-2.5 shrink-0 text-left py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer select-none',
                  'hover:bg-forest-lightSage/90 hover:scale-105 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest text-xs'
                )}
              >
                <div className="w-6 h-6 rounded-md bg-forest-lightSage flex items-center justify-center shrink-0 border border-forest-sage/40">
                  <CommodityIcon commodity={item.commodityName} size={15} />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-surface-darkCharcoal">
                    <span>{item.commodityName}</span>
                    {item.variety && (
                      <span className="text-[11px] font-normal text-surface-muted">
                        ({item.variety})
                      </span>
                    )}
                    <span className="text-surface-muted">&bull;</span>
                    <span className="text-forest font-medium">{item.marketName}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-surface-charcoal">
                      {formattedPrice}
                      <span className="text-[10px] font-normal text-surface-muted ml-0.5">
                        /quintal
                      </span>
                    </span>

                    <Badge
                      variant={item.freshnessStatus === 'FRESH' ? 'fresh' : 'acceptable'}
                      size="sm"
                      dot={false}
                    >
                      {item.observationDate}
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
