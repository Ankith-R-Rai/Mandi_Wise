export type DateRangePreset = '7d' | '30d' | '90d' | '1y' | 'all';

export interface HistoricalPricePoint {
  observationDate: string; // YYYY-MM-DD
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  freshnessStatus: 'FRESH' | 'ACCEPTABLE' | 'STALE';
}

export interface MarketTrendSeries {
  marketId: string;
  marketName: string;
  district: string;
  dataPoints: HistoricalPricePoint[];
}

export interface PriceTrendStats {
  latestModalPrice: number;
  periodHigh: number;
  periodLow: number;
  periodAverage: number;
  percentageChange: number;
  observationCount: number;
}

export interface PriceTrendResponse {
  commodityId: string;
  commodityName: string;
  commodityKannadaName?: string;
  startDate: string;
  endDate: string;
  priceUnit: string;
  series: MarketTrendSeries[];
  stats: Record<string, PriceTrendStats>;
}

export interface TrendQueryParams {
  commodity?: string;
  markets?: string[];
  range?: DateRangePreset;
  startDate?: string;
  endDate?: string;
}
